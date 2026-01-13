# Plan-04: Phase 1A - Backend 가독성 리팩토링 (Controller/Service/Filter)

> **Phase**: 1A (Backend Readability - Split First)  
> **생성일**: 2026-01-13  
> **완료일**: 2026-01-13  
> **상태**: ✅ 완료

---

## 목표

ROADMAP 1A.3 ~ 1A.8 항목 중 핵심 메서드들을 **20줄 이하**로 분할하고, **디버그 로깅(System.out.println)을 제거**합니다.

---

## 작업 체크리스트

### 1. AddressController 리팩토링

- [x] **1.1** `addAddress` 메서드 분할
  - `findMemberIdxById(String memberId)` 추출 ✅
  - `createAddressFromDTO(AddressDTO dto, Long memberIdx)` 추출 ✅
  - System.out.println 제거 ✅

- [x] **1.2** `addAddress1` 이름 변경
  - `updateAllAddresses`로 변경 ✅

### 2. MemberService 리팩토링

- [x] **2.1** `registerMember` 메서드 분할
  - `isExistingMember(String id)` 추출 ✅
  - `createMemberFromDTO(MemberDTO dto)` 추출 ✅

- [x] **2.2** `login` 메서드 정리
  - System.out.println 2개 제거 ✅
  - `isValidPassword()` 추출 ✅
  - 상수 추출 (`JWT_EXPIRATION_MS`, `DEFAULT_ROLE`) ✅

### 3. LoginFilter 리팩토링

- [x] **3.1** `attemptAuthentication` 분할
  - `configureParameters()` 추출 ✅
  - System.out.println 3개 제거 ✅

- [x] **3.2** `successfulAuthentication` 정리
  - `extractRoleFromAuthorities()` 추출 ✅
  - System.out.println 1개 제거 ✅
  - 상수 추출 (`JWT_EXPIRATION_SECONDS`) ✅

- [x] **3.3** `unsuccessfulAuthentication` 정리
  - System.out.println 1개 제거 ✅
  - 상수 추출 (`UNAUTHORIZED_STATUS`) ✅

---

## 리팩토링 결과

### 제거된 System.out.println
| 파일 | 제거 수 |
|------|--------|
| AddressController | 2개 |
| MemberService | 2개 |
| LoginFilter | 6개 |
| **총계** | **10개** |

### 추출된 메서드/상수
| 파일 | 메서드 | 상수 |
|------|--------|------|
| AddressController | 2개 | - |
| MemberService | 4개 | 2개 |
| LoginFilter | 2개 | 4개 |
| **총계** | **8개** | **6개** |

### 테스트 결과
- 컴파일: BUILD SUCCESSFUL ✅
- 단위 테스트: 12/12 통과 ✅

---

## 완료 기준 달성

1. ✅ 모든 대상 메서드 20줄 이하
2. ✅ System.out.println 모두 제거 (10개)
3. ✅ 매직 넘버 상수 추출 (6개)
4. ✅ 컴파일 및 단위 테스트 통과
