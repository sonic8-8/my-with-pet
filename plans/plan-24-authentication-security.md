# Plan-24: 인증/보안 이슈 해결 (Phase 6A)

> **상태**: ✅ 완료  
> **생성일**: 2026-01-16  
> **관련**: ROADMAP.md Phase 6A, REVIEW.md

---

## 목표

Codex 코드 리뷰에서 발견된 인증/보안 관련 Critical 이슈들을 해결합니다.

| # | 이슈 | 현재 상태 | 목표 상태 |
|---|------|----------|----------|
| 6A.1 | 역할 표준화 | `user`/`ceo` 저장 | `ROLE_USER`/`ROLE_BUSINESS` 저장 |
| 6A.2 | 공개 URL 불일치 | `/api/register` 공개 | `/api/sign-up` 공개 |
| 6A.3 | JWT 만료 시간 단위 | seconds 전달 | milliseconds 전달 |
| 6A.4 | JWT 예외 처리 | 예외 시 필터 통과 | 예외 시 401 응답 |

---

## 현재 문제 분석

### 1. 역할(Role) 불일치

**SecurityConfig.java** (Line 84-86):
```java
.requestMatchers(USER_URLS).hasAnyRole("USER", "ADMIN")
.requestMatchers(BUSINESS_URLS).hasAnyRole("BUSINESS", "ADMIN")
```
→ Spring Security의 `hasAnyRole()`은 자동으로 `ROLE_` prefix를 붙여서 검사합니다.
→ 즉, `ROLE_USER`, `ROLE_BUSINESS`를 기대합니다.

**MemberService.java** (Line 16, 68):
```java
private static final String DEFAULT_ROLE = "user";
member.setRole(DEFAULT_ROLE);
```
→ 실제 저장되는 값: `user` (❌ `ROLE_USER` 아님)

**StoreMemberService.java** (Line 26):
```java
storeMember.setRole("ceo");
```
→ 실제 저장되는 값: `ceo` (❌ `ROLE_BUSINESS` 아님)

**결과**: 모든 보호된 API 호출 시 403 Forbidden 발생

---

### 2. 공개 URL / 실제 엔드포인트 불일치

**SecurityConfig.java** (Line 29-33):
```java
private static final String[] PUBLIC_URLS = {
    "/api/login", "/api/register",  // ❌ 실제 엔드포인트: /api/sign-up
    "/api/store-list/**", "/api/shop/**", "/api/store-info",
    "/api/review", "/api/main/**"
};
```

**MemberController.java** (Line 21):
```java
@PostMapping("/sign-up")  // ✅ 실제 엔드포인트
```

**StoreMemberController.java** (Line 16, 23):
```java
@RequestMapping("/api/business/")
@PostMapping("/sign-up")  // → /api/business/sign-up
```
→ `/api/business/**`가 BUSINESS 역할 필요로 설정되어 있어 사업자 가입 불가

---

### 3. JWT 만료 시간 단위 오류

**LoginFilter.java** (Line 22, 49):
```java
private static final long JWT_EXPIRATION_SECONDS = 60 * 60 * 10L; // 36000 (seconds)
String token = jwtUtil.createJwt(id, role, JWT_EXPIRATION_SECONDS);
```

**JWTUtil.java** (Line 41, 48):
```java
public String createJwt(String id, String role, Long expiredMs) {  // ms 기대
    .expiration(new Date(System.currentTimeMillis() + expiredMs))  // ms로 계산
```

**결과**: 36000ms = 36초 만에 토큰 만료 (의도: 10시간)

---

### 4. JWT 예외 처리 부재

**JWTFilter.java** (Line 57-58):
```java
private boolean isValidToken(String token) {
    return !jwtUtil.isExpired(token);  // 서명 오류 시 예외 발생 → 500 에러
}
```

**JWTUtil.java** (Line 36-38):
```java
public Boolean isExpired(String token) {
    return Jwts.parser().verifyWith(secretKey).build()
        .parseSignedClaims(token)  // 잘못된 서명 시 SignatureException 발생
        .getPayload().getExpiration().before(new Date());
}
```

**결과**: 잘못된 토큰 → 예외 → 500 Internal Server Error

---

## 수정 계획

### 6A.1 역할 표준화

#### [MODIFY] MemberService.java

```diff
- private static final String DEFAULT_ROLE = "user";
+ private static final String DEFAULT_ROLE = "ROLE_USER";
```

#### [MODIFY] StoreMemberService.java

```diff
- storeMember.setRole("ceo");
+ storeMember.setRole("ROLE_BUSINESS");
```

> **주의**: 기존 DB에 `user`/`ceo`로 저장된 데이터가 있다면 마이그레이션 필요

---

### 6A.2 공개 URL 수정

#### [MODIFY] SecurityConfig.java

```diff
  private static final String[] PUBLIC_URLS = {
-     "/api/login", "/api/register",
+     "/api/login", "/api/sign-up",
+     "/api/business/login", "/api/business/sign-up",  // 사업자 공개 경로 추가
      "/api/store-list/**", "/api/shop/**", "/api/store-info",
      "/api/review", "/api/main/**"
  };
```

---

### 6A.3 JWT 만료 시간 단위 수정

#### [MODIFY] LoginFilter.java

```diff
- private static final long JWT_EXPIRATION_SECONDS = 60 * 60 * 10L; // 10시간
+ private static final long JWT_EXPIRATION_MS = 1000L * 60 * 60 * 10; // 10시간 (ms)

  String token = jwtUtil.createJwt(id, role, JWT_EXPIRATION_MS);
```

---

### 6A.4 JWT 예외 처리 추가

#### [MODIFY] JWTFilter.java

```java
@Override
protected void doFilterInternal(HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain) throws ServletException, IOException {
    
    Optional<String> token = extractToken(request);

    if (token.isEmpty()) {
        filterChain.doFilter(request, response);
        return;
    }

    try {
        if (jwtUtil.isExpired(token.get())) {
            sendUnauthorizedResponse(response, "Token expired");
            return;
        }
        setAuthenticationContext(token.get());
        filterChain.doFilter(request, response);
    } catch (io.jsonwebtoken.ExpiredJwtException e) {
        sendUnauthorizedResponse(response, "Token expired");
    } catch (io.jsonwebtoken.JwtException e) {
        sendUnauthorizedResponse(response, "Invalid token");
    }
}

private void sendUnauthorizedResponse(HttpServletResponse response, String message) 
        throws IOException {
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.setContentType("application/json");
    response.getWriter().write("{\"error\": \"" + message + "\"}");
}
```

---

## 검증 계획

### 자동화 테스트

```bash
# Backend 빌드 확인
cd back-end && ./gradlew build

# 기존 테스트 통과 확인
./gradlew test
```

### 수동 검증

1. **회원가입 테스트**
   - `POST /api/sign-up` → 200 OK, DB에 `ROLE_USER` 저장 확인
   - `POST /api/business/sign-up` → 200 OK, DB에 `ROLE_BUSINESS` 저장 확인

2. **로그인 + 토큰 검증**
   - 로그인 후 10시간 경과 전까지 토큰 유효 확인
   - 잘못된 토큰으로 API 호출 시 401 응답 확인

3. **역할 기반 접근 제어**
   - `ROLE_USER` 토큰으로 `/api/address` 접근 → 200 OK
   - `ROLE_USER` 토큰으로 `/api/business/**` 접근 → 403 Forbidden
   - `ROLE_BUSINESS` 토큰으로 `/api/business/**` 접근 → 200 OK

---

## 영향 범위

| 파일 | 변경 내용 |
|------|----------|
| `MemberService.java` | DEFAULT_ROLE 상수 변경 |
| `StoreMemberService.java` | role 값 변경 |
| `SecurityConfig.java` | PUBLIC_URLS 배열 수정 |
| `LoginFilter.java` | 만료 시간 상수 변경 |
| `JWTFilter.java` | 예외 처리 로직 추가 |

---

## 의존성

- 없음 (독립적으로 수행 가능)

## 예상 소요 시간

- 구현: 1시간
- 테스트: 30분
