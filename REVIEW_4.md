# REVIEW_4.md - HttpOnly Cookie 전환 가이드

> 목적: JWT를 HttpOnly 쿠키로 전환하여 XSS 탈취 위험을 낮추고 배포 전 보안 수준을 끌어올린다.
> 기준: 실무 권장 보안 패턴 (OWASP 권장 흐름 준용)

---

## 1) 왜 HttpOnly인가

- JS 접근 차단으로 **XSS 토큰 탈취 위험을 실질적으로 낮춤**
- 실무 표준: 인증 토큰을 **HttpOnly + Secure + SameSite**로 보호
- 헤더 주입 누락 등 클라이언트 실수를 줄여 **운영 안정성 향상**

---

## 2) 전환 범위 요약

### Backend
- 로그인 성공 시 JWT를 **Set-Cookie**로 발급
- JWT 검증 필터가 **쿠키에서 토큰을 읽도록 지원**
- CORS에서 `allowCredentials(true)` 유지

### Frontend
- `Cookies.set('token', ...)` 제거
- `Authorization` 헤더 자동 주입 제거
- `withCredentials: true` 유지

---

## 3) 함께 가야 하는 설정 (필수)

### 3-1. Cookie 속성
- `HttpOnly`: JS 접근 차단 (필수)
- `Secure`: HTTPS에서만 전송 (배포 환경 필수)
- `SameSite`:
  - 기본 권장: `Lax`
  - 프론트/백엔드 도메인이 다르면 `None` + `Secure` 필요
- `Path=/` 및 적절한 `Max-Age` 또는 `Expires`

### 3-2. CORS
- `allowCredentials(true)` 유지
- `allowedOrigins`를 배포 도메인으로 제한 (와일드카드 금지)

### 3-3. CSRF 대응
- SameSite로 1차 방어
- 민감 변경 요청(결제, 주문 등)은 **CSRF 토큰** 추가 고려

---

## 4) 적용 순서 (실무 추천)

1) Backend: 로그인 성공 시 HttpOnly 쿠키 발급
2) Backend: JWTFilter에서 쿠키 토큰 읽기 지원
3) Frontend: 토큰 저장/헤더 주입 코드 제거
4) CORS + Cookie 속성 점검 (Secure/SameSite)
5) QA: 로그인/인증 플로우 확인

---

## 5) 변경 대상 파일 (대표)

- `back-end/src/main/java/com/apple/shop/member/jwt/LoginFilter.java`
- `back-end/src/main/java/com/apple/shop/member/jwt/JWTFilter.java`
- `back-end/src/main/java/com/apple/shop/member/jwt/JWTUtil.java`
- `back-end/src/main/java/com/apple/shop/SecurityConfig.java`
- `front-end/src/api/axiosConfig.js`
- `front-end/src/customerPage/Login.js`
- `front-end/src/businessPage/BizLogin.js`
- `front-end/src/Redux/store.js`

---

## 6) 체크리스트

- [ ] 로그인 성공 시 Set-Cookie로 JWT 발급
- [ ] 쿠키가 HttpOnly/Secure/SameSite로 설정됨
- [ ] 프론트가 토큰을 저장하지 않음
- [ ] `/api` 요청에 쿠키가 자동 전송됨
- [ ] 배포 도메인에서 CORS 정책 정상 동작

---

## 7) 비고

- 로컬 개발 환경에서는 Secure 쿠키가 동작하지 않으므로 `Secure` 조건 분기 필요
- 프론트와 백엔드 도메인이 분리되면 SameSite=None 설정이 필수
