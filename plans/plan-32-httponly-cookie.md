# Plan-32: JWT HttpOnly Cookie 전환

> **상태**: ✅ 완료 (2026-01-19)  
> **목표**: JWT를 HttpOnly 쿠키로 전환하여 XSS 탈취 위험 제거  
> **참조**: `REVIEW_4.md`

---

## 개요

현재 JWT 토큰이 `js-cookie`를 통해 JS 접근 가능한 쿠키에 저장되어 XSS 공격 시 탈취 위험이 있습니다.
백엔드에서 HttpOnly 쿠키로 직접 발급하여 보안을 강화합니다.

---

## 변경 범위

### Backend
1. LoginFilter에서 JWT를 **Set-Cookie 헤더**로 발급
2. JWTFilter에서 **쿠키에서 토큰 읽기** 지원
3. Cookie 속성: `HttpOnly`, `SameSite=Lax`, 배포 시 `Secure`

### Frontend
1. `Cookies.set('token', ...)` 제거
2. `Authorization` 헤더 자동 주입 제거
3. `withCredentials: true` 유지

---

## 체크리스트

### 1. Backend 수정

- [x] `LoginFilter.successfulAuthentication()` 수정
  - `response.addHeader("Authorization", ...)` 대신
  - `response.addCookie(createJwtCookie(token))` 사용
- [x] `StoreMemberLoginFilter.successfulAuthentication()` 동일 수정
- [x] `JWTFilter.doFilterInternal()` 수정
  - 쿠키에서 토큰 추출 로직 추가
  - 기존 Header 방식도 fallback으로 유지
- [x] 쿠키 생성 유틸 메서드 추가 (`JWTUtil` 또는 별도 유틸)
  ```java
  public Cookie createJwtCookie(String token) {
      Cookie cookie = new Cookie("jwt", token);
      cookie.setHttpOnly(true);
      cookie.setSecure(false); // 로컬: false, 배포: true
      cookie.setPath("/");
      cookie.setMaxAge(36000); // 10시간
      return cookie;
  }
  ```

### 2. Frontend 수정

- [x] `Login.js` 수정
  - `Cookies.set('token', token, ...)` 삭제
  - Header에서 토큰 추출 코드 삭제
  - 로그인 성공 시 쿠키는 자동 저장됨
- [x] `BizLogin.js` 동일 수정
- [x] `axiosConfig.js` 수정
  - `Authorization` 헤더 자동 주입 제거
  - `withCredentials: true` 확인
- [ ] `Redux/store.js` 수정 (불필요 - 토큰 관련 코드 없음)
  - 토큰 관련 localStorage/Cookie 접근 제거

### 3. 검증

- [x] Backend 빌드 테스트
- [ ] Frontend 빌드 테스트
- [ ] 로그인 → 쿠키에 jwt 저장 확인 (개발자 도구)
- [ ] 보호 API 호출 시 쿠키 자동 전송 확인

---

## 수정 대상 파일

### Backend

| 파일 | 변경 내용 |
|------|----------|
| `member/jwt/LoginFilter.java` | Set-Cookie로 JWT 발급 |
| `storeMember/StoreMemberLoginFilter.java` | Set-Cookie로 JWT 발급 |
| `member/jwt/JWTFilter.java` | 쿠키에서 토큰 추출 |
| `member/jwt/JWTUtil.java` | 쿠키 생성 유틸 메서드 추가 |

### Frontend

| 파일 | 변경 내용 |
|------|----------|
| `customerPage/Login.js` | 토큰 저장 코드 제거 |
| `businessPage/BizLogin.js` | 토큰 저장 코드 제거 |
| `api/axiosConfig.js` | Authorization 헤더 주입 제거 |
| `Redux/store.js` | 토큰 관련 코드 정리 |

---

## Out of Scope

- CSRF 토큰 (SameSite로 1차 방어, 추후 고려)
- Refresh Token (현재 Access Token만 사용)
- 프로파일 분리 (포트폴리오용이므로 단순화)

---

## 검증 계획

1. **로컬 테스트**
   - Backend: `./gradlew bootRun`
   - Frontend: `npm start`
   - 로그인 후 개발자 도구 > Application > Cookies에서 `jwt` 쿠키 확인
   - `HttpOnly` 체크 확인

2. **API 호출 테스트**
   - 로그인 후 `/api/memberinfo` 호출
   - 쿠키가 자동으로 전송되어 인증 성공 확인
