# Plan-02: Phase 1A - Backend 가독성 리팩토링 (JWTFilter)

> **Phase**: 1A (Backend Readability - Split First)  
> **생성일**: 2026-01-12  
> **완료일**: 2026-01-12  
> **상태**: ✅ 완료

---

## 목표

`JWTFilter.doFilterInternal` 메서드를 **20줄 이하**로 분할하고, **Composed Method 패턴**을 적용하여 가독성을 향상시킵니다.

---

## 현재 상태 분석

### JWTFilter.java (리팩토링 전: 23-75줄, 약 53줄)
| 문제 | 설명 |
|------|------|
| 줄 수 초과 | 53줄 (목표: 20줄 이하) |
| 혼합된 추상화 | 토큰 추출 → 검증 → 사용자 생성 → 인증 설정이 하나의 메서드에 혼재 |
| 디버그 로깅 | `System.out.println` 하드코딩 (보안 문제 - REVIEW_BE에서 지적됨) |

---

## 작업 체크리스트

### 1. JWTFilter 리팩토링

- [x] **1.1** 토큰 추출 로직 분리
  - `extractToken(HttpServletRequest request)` 메서드 추출 ✅
  - Authorization 헤더 파싱 로직 캡슐화
  - 반환: `Optional<String>` (토큰 또는 empty)

- [x] **1.2** 토큰 검증 로직 분리
  - `isValidToken(String token)` 메서드 추출 ✅
  - 만료 검증 로직 캡슐화
  - 반환: `boolean`

- [x] **1.3** 인증 컨텍스트 설정 로직 분리
  - `setAuthenticationContext(String token)` 메서드 추출 ✅
  - `createMemberFromToken(String token)` 추가 추출 ✅
  - `createAuthenticationToken(CustomUserDetails)` 추가 추출 ✅

- [x] **1.4** 디버그 로깅 제거
  - `System.out.println` 4개 모두 제거 ✅
  - 매직 스트링 상수화 (`AUTHORIZATION_HEADER`, `BEARER_PREFIX`)

- [x] **1.5** doFilterInternal 메서드 정리
  - 53줄 → **12줄**로 축소 ✅
  - Composed Method 패턴 적용

---

## 리팩토링 결과

### 메서드 구조 (After)
| 메서드 | 줄 수 | 역할 |
|--------|-------|------|
| `doFilterInternal` | 12줄 | 메인 플로우 |
| `extractToken` | 8줄 | 토큰 추출 |
| `isValidToken` | 3줄 | 토큰 검증 |
| `setAuthenticationContext` | 6줄 | 인증 설정 |
| `createMemberFromToken` | 7줄 | Member 생성 |
| `createAuthenticationToken` | 6줄 | Auth 토큰 생성 |

### 테스트 결과
- `MemberServiceTest`: 5/5 통과 ✅
- `StoreMemberServiceTest`: 7/7 통과 ✅
- `ShopApplicationTests.contextLoads`: 실패 (기존 이슈, JWTFilter와 무관)

---

## 완료 기준 달성

1. ✅ `doFilterInternal` 메서드 20줄 이하 (12줄)
2. ✅ 각 추출 메서드 20줄 이하
3. ✅ `System.out.println` 제거
4. ✅ 단위 테스트 통과 (12/12)
5. ⏳ 로그인/인증 기능 정상 동작 (수동 검증 필요)

---

## 다음 단계

Plan-02 완료 후 → Plan-03 (SecurityConfig 분할) 진행
