# ADR-008: JWT HttpOnly Cookie 저장 방식

## 날짜
2026-01-19

## 상태
✅ 채택

## 맥락 (Context)
기존에 JWT 토큰이 프론트엔드에서 `js-cookie`를 통해 저장되어 XSS 공격 시 탈취 위험이 있었습니다.
- `Cookies.set('token', token)` 방식으로 JavaScript에서 접근 가능
- XSS 취약점 발생 시 토큰 탈취 가능

## 결정 (Decision)
- 백엔드에서 `Set-Cookie` 헤더로 JWT 발급
- Cookie 속성: `HttpOnly=true`, `Path=/`, `MaxAge=36000` (10시간)
- 프론트엔드에서 토큰 저장 코드 제거
- 기존 Authorization Header 방식은 fallback으로 유지
- `withCredentials: true`로 쿠키 자동 전송

## 결과 (Consequences)
### 장점
- JavaScript에서 토큰 접근 불가 (XSS 방어)
- 프론트엔드 코드 간소화
- 쿠키 자동 전송으로 헤더 관리 불필요

### 단점
- 로컬 개발 시 `Secure=false` 설정 필요
- 크로스 도메인 시 `SameSite=None` 필요
- CSRF 공격에 대한 별도 대응 필요 (SameSite로 1차 방어)

## 관련 Plan
- Plan-32
- REVIEW_4.md
