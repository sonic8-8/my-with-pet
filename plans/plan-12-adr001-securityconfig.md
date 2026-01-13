# Plan-12: ADR-001 SecurityConfig 인증 정책 구현

> **Phase**: 3A (Security - Backend)  
> **생성일**: 2026-01-13  
> **완료일**: 2026-01-13  
> **상태**: ✅ 완료  
> **관련 ADR**: [ADR-001](../adr/ADR-001-security-config-auth.md)

---

## 목표

ADR-001에서 결정된 **역할 기반 접근 제어(RBAC)**를 `SecurityConfig.java`에 구현합니다.

---

## 현재 상태

```java
// SecurityConfig.java - configureAuthorization()
http.authorizeHttpRequests(auth -> auth
        .requestMatchers("/**", "/api/**").permitAll()
        .anyRequest().authenticated());
```

**문제**: 모든 API 엔드포인트가 인증 없이 접근 가능

---

## 구현 체크리스트

### 1. SecurityConfig 수정

- [ ] **1.1** 공개 API 경로 상수 정의
  ```java
  private static final String[] PUBLIC_URLS = {
      "/api/login", "/api/register",
      "/api/store-list/**", "/api/shop/**", "/api/store-info",
      "/api/review", "/api/main/**"
  };
  ```

- [ ] **1.2** 고객 전용 API 경로 상수 정의
  ```java
  private static final String[] USER_URLS = {
      "/api/address/**", "/api/order/**", "/api/cart/**"
  };
  ```

- [ ] **1.3** 사업자 전용 API 경로 상수 정의
  ```java
  private static final String[] BUSINESS_URLS = {
      "/api/business/**"
  };
  ```

- [ ] **1.4** `configureAuthorization` 메서드 수정
  ```java
  http.authorizeHttpRequests(auth -> auth
      .requestMatchers(PUBLIC_URLS).permitAll()
      .requestMatchers(USER_URLS).hasAnyRole("USER", "ADMIN")
      .requestMatchers(BUSINESS_URLS).hasAnyRole("BUSINESS", "ADMIN")
      .anyRequest().authenticated()
  );
  ```

### 2. 역할 부여 확인

- [ ] **2.1** `MemberService.registerMember`에서 역할 부여 확인
- [ ] **2.2** `LoginFilter.successfulAuthentication`에서 JWT에 역할 포함 확인

---

## 검증 계획

### 자동 테스트
```bash
cd back-end
.\gradlew compileJava --no-daemon -q
.\gradlew test --no-daemon -q
```

### 수동 테스트
1. **공개 API 테스트** (인증 없이 접근 가능해야 함):
   - `GET http://localhost:8085/api/store-list/0`
   - `GET http://localhost:8085/api/shop/1`

2. **인증 필요 API 테스트** (401 반환해야 함):
   - `GET http://localhost:8085/api/address?memberId=test` (인증 없이)

3. **인증 후 API 테스트** (정상 응답해야 함):
   - 로그인 후 JWT 토큰으로 `/api/address` 호출

---

## 예상 영향

| 영역 | 영향 |
|------|------|
| Frontend | JWT 토큰 미포함 시 인증 필요 API 호출 실패 |
| 기존 사용자 | 공개 API는 영향 없음, 인증 필요 API는 로그인 필수 |

---

## 완료 기준

1. ✅ SecurityConfig RBAC 적용
2. ✅ Backend 컴파일 성공
3. ✅ 기존 테스트 통과
