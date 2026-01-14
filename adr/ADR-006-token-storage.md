# ADR-006: 토큰 저장 방식 개선

> **상태**: 📋 향후 개선 (HTTPS 전환 시)  
> **생성일**: 2026-01-13  
> **결정자**: 사용자 승인 (2026-01-14)

---

## 컨텍스트

현재 JWT 토큰을 **LocalStorage** 또는 **일반 쿠키**에 저장하고 있습니다.

### 문제점
- LocalStorage는 JavaScript로 접근 가능 → XSS 공격 시 토큰 탈취
- 일반 쿠키도 `httpOnly` 플래그 없으면 동일한 위험

### 심각도
🟡 **MEDIUM → HIGH** (XSS 취약점 존재 시 CRITICAL)

---

## 결정 옵션

### 옵션 A: HttpOnly Cookie 사용 ⭐ 권장

**Backend에서 쿠키 설정**:
```java
ResponseCookie cookie = ResponseCookie.from("token", jwt)
    .httpOnly(true)
    .secure(true)  // HTTPS 필수
    .sameSite("Strict")
    .path("/")
    .maxAge(Duration.ofHours(1))
    .build();
response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
```

**장점**:
- JavaScript에서 토큰 접근 불가
- XSS 공격으로부터 보호

**단점**:
- HTTPS 필수 (프로덕션)
- Frontend 코드 변경 필요

---

### 옵션 B: 현재 방식 유지 + XSS 방어 강화

- Content-Security-Policy 헤더 적용
- 입력값 검증 강화

**장점**:
- Frontend 변경 최소화

**단점**:
- 근본적 해결 아님

---

## 권장 결정

**옵션 A: HttpOnly Cookie 사용**

단, HTTPS 인프라 구축 후 적용 권장.

---

## 구현 계획

1. Backend: LoginFilter에서 HttpOnly Cookie 설정
2. Frontend: localStorage 대신 쿠키 자동 전송 활용
3. CORS 설정에 `credentials: true` 확인

---

## 승인 요청

> [!NOTE]
> 이 변경은 HTTPS 환경에서 최대 효과를 발휘합니다.
> 개발 환경에서는 `secure: false`로 테스트 가능합니다.

**승인 시 구현을 진행하겠습니다.**
