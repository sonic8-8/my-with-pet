# Plan-31: Pre-Deploy Hardening (REVIEW_3.md)

> **상태**: ✅ 완료 (2026-01-19)  
> **목표**: GCP 배포 전 오류/리스크 최소화 및 부하테스트 신뢰도 확보  
> **참조**: `REVIEW_3.md`

---

## 개요

GCP 배포 전 REVIEW_3.md에서 발견된 Critical/High 이슈를 해결합니다.  
작업 순서: **보안/인증/결제 → 빌드/배포 → 기능 안정화**

---

## 체크리스트

### 1. 보안/인증/결제 (🔴 Critical)

#### 1-1. 민감 정보 노출 방지

- [x] `MemberResponseDTO` 생성 (비밀번호 제외)
- [x] `StoreMemberResponseDTO` 생성 (비밀번호 제외)
- [x] `AddressController.getMemberInfo()` → DTO 반환으로 변경
- [x] `StoreMemberController.getCurrentUser()` → DTO 반환으로 변경
- [x] `Member.pw` 필드에 `@JsonIgnore` 추가 (이중 보호)
- [x] `StoreMember.pw` 필드에 `@JsonIgnore` 추가 (이중 보호)

#### 1-2. 결제 검증 추가

- [x] `PaymentController.confirmPayment()` 서버측 기본 검증 추가
  - orderId, paymentKey 필수 체크
  - amount > 0 양수 검증
  - Toss Payments API 실연동은 TODO 주석으로 명시

#### 1-3. JWT 저장 방식 개선 (HttpOnly Cookie)

> ⚠️ **범위 제한**: 대규모 변경이 필요하므로 이번 Plan에서는 **TODO 주석**만 추가합니다.  
> 실제 구현은 별도 Plan으로 진행합니다.

- [x] `Login.js`에 TODO 주석 추가 (현재 방식의 위험성 명시)

---

### 2. 빌드/배포 실패 요인 (🔴 Critical)

#### 2-1. Firebase CDN ESM import 제거

- [x] `package.json`에 `firebase: ^10.12.2` 패키지 추가
- [x] `Login.js` Firebase import를 npm 패키지로 변경:
  ```javascript
  // Before (CDN ESM - CRA 빌드 실패)
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  
  // After (npm package)
  import { initializeApp } from "firebase/app";
  ```

#### 2-2. 로그인 경로 통일 (`/api/login`)

- [x] `SecurityConfig.java` PUBLIC_URLS에 `/api/login` 추가
- [x] `LoginFilter` 경로 `/login` → `/api/login` 변경
- [x] `Login.js` 요청 경로 `/login` → `/api/login` 변경

---

### 3. 기능 안정화 (🟡 High)

#### 3-1. 중복 회원가입 처리

- [x] `MemberService.registerMember()` 수정:
  - 중복 시 `return` → `IllegalStateException` 발생
- [x] `MemberController.join()` 수정:
  - 예외 catch 후 `409 Conflict` 응답
- [x] `StoreMemberController.join()` 수정:
  - `ResponseEntity<String>` 반환, 중복 시 `409 Conflict` 응답

#### 3-2. Optional.get() 제거

- [x] `StoreMemberService.getMemberById()` 수정:
  - `.get()` → `.orElseThrow(() -> new NoSuchElementException(...))`

---

## 수정된 파일 요약

### Backend

| 파일 | 변경 내용 |
|------|----------|
| `member/MemberResponseDTO.java` | **[NEW]** 비밀번호 제외 응답 DTO |
| `storeMember/StoreMemberResponseDTO.java` | **[NEW]** 비밀번호 제외 응답 DTO |
| `member/Member.java` | `@JsonIgnore` 추가 |
| `storeMember/StoreMember.java` | `@JsonIgnore` 추가 |
| `storeMember/StoreMemberUserDetails.java` | `getStoreMember()` getter 추가 |
| `address/AddressController.java` | `getMemberInfo()` DTO 반환, import 추가 |
| `storeMember/StoreMemberController.java` | `getCurrentUser()` DTO 반환, `join()` 409 응답 |
| `payment/PaymentController.java` | 서버측 기본 검증 추가 |
| `member/MemberService.java` | 중복 시 예외 발생 |
| `member/MemberController.java` | 409 Conflict 응답 |
| `storeMember/StoreMemberService.java` | `Optional.get()` 제거 |
| `SecurityConfig.java` | PUBLIC_URLS에 `/api/login` 추가 |

### Frontend

| 파일 | 변경 내용 |
|------|----------|
| `customerPage/Login.js` | Firebase npm import, `/api/login` 경로, TODO 주석 |
| `package.json` | `firebase: ^10.12.2` 추가 |

---

## Out of Scope

- JWT → HttpOnly Cookie 전환 (별도 Plan)
- Toss Payments 실제 API 연동 (Secret Key 필요)
- 국세청 사업자등록번호 API 연동
- Firebase 초기화 코드 분리 (firebaseConfig.js)

---

## Verification

- [x] Backend Gradle 빌드 성공 (Exit code 0)
- [ ] Frontend npm install + npm run build (firebase 설치 필요)
- [ ] 통합 테스트 (수동)

---

## Commits

1. `fix(security): Plan-31 배포 전 필수 보안 강화` - 16 files changed
2. `fix(plan-31): 리뷰 이슈 추가 수정` - 3 files changed
