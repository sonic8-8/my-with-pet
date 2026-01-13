# Plan-03: Phase 1A - Backend 가독성 리팩토링 (SecurityConfig)

> **Phase**: 1A (Backend Readability - Split First)  
> **생성일**: 2026-01-13  
> **완료일**: 2026-01-13  
> **상태**: ✅ 완료

---

## 목표

`SecurityConfig.filterChain` 메서드를 **20줄 이하**로 분할하고, 주석 처리된 코드를 정리하며, **Composed Method 패턴**을 적용합니다.

---

## 현재 상태 분석

### SecurityConfig.java (리팩토링 전: 42-77줄, 약 35줄)
| 문제 | 설명 |
|------|------|
| 줄 수 초과 | filterChain 35줄 (목표: 20줄 이하) |
| 주석 처리 코드 | 52-58줄에 주석 처리된 인가 설정 코드 존재 |
| 혼합된 설정 | CSRF, 폼로그인, 인가, 필터, 세션 설정이 하나의 메서드에 혼재 |
| 보안 이슈 | `"/**"` permitAll로 전체 인증 무력화 (REVIEW_BE에서 지적) |

---

## 작업 체크리스트

### 1. SecurityConfig 리팩토링

- [x] **1.1** 기본 보안 설정 분리
  - `configureBasicSecurity(HttpSecurity http)` 메서드 추출 ✅

- [x] **1.2** 인가 설정 분리
  - `configureAuthorization(HttpSecurity http)` 메서드 추출 ✅
  - 주석 처리된 코드 삭제 ✅
  - TODO 주석 추가 (ADR 필요 표시)

- [x] **1.3** 필터 설정 분리
  - `configureFilters(HttpSecurity http)` 메서드 추출 ✅

- [x] **1.4** 세션 설정 분리
  - `configureSessionManagement(HttpSecurity http)` 메서드 추출 ✅

- [x] **1.5** filterChain 메서드 정리
  - 35줄 → **7줄**로 축소 ✅
  - Composed Method 패턴 적용

---

## 리팩토링 결과

### 메서드 구조 (After)
| 메서드 | 줄 수 | 역할 |
|--------|-------|------|
| `filterChain` | 7줄 | 메인 플로우 |
| `configureBasicSecurity` | 5줄 | CSRF, 폼로그인, HTTP Basic 비활성화 |
| `configureAuthorization` | 5줄 | URL 인가 규칙 |
| `configureFilters` | 6줄 | JWT, Login 필터 등록 |
| `configureSessionManagement` | 4줄 | STATELESS 세션 정책 |

### 테스트 결과
- 컴파일: BUILD SUCCESSFUL ✅
- `MemberServiceTest`: 5/5 통과 ✅
- `StoreMemberServiceTest`: 7/7 통과 ✅

---

## 완료 기준 달성

1. ✅ `filterChain` 메서드 20줄 이하 (7줄)
2. ✅ 각 추출 메서드 20줄 이하
3. ✅ 주석 처리된 코드 삭제
4. ✅ 단위 테스트 통과 (12/12)

---

## 범위 제외 (별도 ADR 필요)

> [!IMPORTANT]
> 현재 `"/**"` permitAll 설정은 **보안 이슈**이지만, 인가 정책 변경은 시스템 동작에 큰 영향을 미치므로 ADR 작성 후 별도 진행합니다.

---

## 다음 단계

Plan-03 완료 → ROADMAP Phase 1A 나머지 메서드 분할 진행
