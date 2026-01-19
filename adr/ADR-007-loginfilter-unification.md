# ADR-007: LoginFilter 기반 인증 통일

## 날짜
2026-01-18

## 상태
✅ 채택

## 맥락 (Context)
기존에 `MemberController.login()`, `StoreMemberController.login()` 메서드와 Spring Security `LoginFilter`가 공존하여 인증 경로가 이중화되어 있었습니다. 이로 인해:
- 코드 중복
- JWT 발급 로직 불일치
- 보안 정책 적용의 어려움

## 결정 (Decision)
- Controller 기반 로그인 메서드를 모두 삭제
- Spring Security `UsernamePasswordAuthenticationFilter`를 상속한 `LoginFilter` 사용
- 사업자 로그인을 위한 `StoreMemberLoginFilter` 추가
- 경로: 일반 회원 `/api/login`, 사업자 `/api/business/login`

## 결과 (Consequences)
### 장점
- 인증 로직이 Spring Security 표준 방식으로 통일됨
- JWT 발급/검증이 필터 체인에서 일관되게 처리됨
- 보안 정책 일괄 적용 가능

### 단점
- 필터 체인 이해 필요
- 디버깅 시 필터 로그 확인 필요

## 관련 Plan
- Plan-30
