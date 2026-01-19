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

- [ ] `MemberResponseDTO` 생성 (비밀번호 제외)
- [ ] `StoreMemberResponseDTO` 생성 (비밀번호 제외)
- [ ] `AddressController.getMemberInfo()` → DTO 반환으로 변경
- [ ] `StoreMemberController.getCurrentUser()` → DTO 반환으로 변경
- [ ] `Member.pw` 필드에 `@JsonIgnore` 추가 (이중 보호)
- [ ] `StoreMember.pw` 필드에 `@JsonIgnore` 추가 (이중 보호)

#### 1-2. 결제 검증 추가

- [ ] `PaymentController.confirmPayment()` 검증 로직 추가
  - Toss Payments API 서버-서버 검증 (TODO 주석으로 명시)
  - 현재는 요청 파라미터 유효성 검증 + 더미 응답
- [ ] `PERFORMANCE_HYPOTHESIS.md`에 실제 Toss 연동 가설 기록

#### 1-3. JWT 저장 방식 개선 (HttpOnly Cookie)

> ⚠️ **범위 제한**: 이 작업은 대규모 변경이므로 이번 Plan에서는 **문서화 및 TODO 주석**만 추가합니다.  
> 실제 구현은 Phase 7 (Docker) 이후 별도 Plan으로 진행합니다.

- [ ] `SECURITY_TODO.md` 생성 (HttpOnly Cookie 전환 계획 문서화)
- [ ] `Login.js`에 TODO 주석 추가 (현재 방식의 위험성 명시)

---

### 2. 빌드/배포 실패 요인 (🔴 Critical)

#### 2-1. Firebase CDN ESM import 제거

- [ ] `package.json`에 `firebase` 패키지 추가 확인
- [ ] `Login.js` Firebase import를 npm 패키지로 변경:
  ```javascript
  // Before (CDN ESM - CRA 빌드 실패)
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  
  // After (npm package)
  import { initializeApp } from "firebase/app";
  ```
- [ ] Firebase 초기화 코드를 별도 유틸(`firebaseConfig.js`)로 분리

#### 2-2. 로그인 경로 통일 (`/api/login`)

- [ ] `SecurityConfig.java` PUBLIC_URLS에 `/api/login` 추가
- [ ] `LoginFilter` 경로 `/login` → `/api/login` 변경
- [ ] `Login.js` 요청 경로 `/login` → `/api/login` 변경
- [ ] `setupProxy.js`는 `/api` 프록시 유지 (변경 불필요)

---

### 3. 기능 안정화 (🟡 High)

#### 3-1. 중복 회원가입 처리

- [ ] `MemberService.registerMember()` 수정:
  - 중복 시 `return` → 예외 발생 (`DuplicateMemberException`)
- [ ] `MemberController.join()` 수정:
  - 예외 catch 후 `409 Conflict` 응답
- [ ] `StoreMemberController.join()` 수정:
  - 이미 중복 체크 로직 있음 → 응답 코드 `409`로 변경

#### 3-2. Optional.get() 제거

- [ ] `StoreMemberService.getMemberById()` 수정:
  - `.get()` → `.orElseThrow(() -> new NoSuchElementException(...))`
- [ ] `StoreMemberController.getMyInfo()` 수정:
  - 예외 발생 시 `404 Not Found` 응답

---

## 수정 대상 파일 요약

### Backend

| 파일 | 변경 내용 |
|------|----------|
| `member/MemberResponseDTO.java` | **[NEW]** 비밀번호 제외 응답 DTO |
| `storeMember/StoreMemberResponseDTO.java` | **[NEW]** 비밀번호 제외 응답 DTO |
| `member/Member.java` | `@JsonIgnore` 추가 |
| `storeMember/StoreMember.java` | `@JsonIgnore` 추가 |
| `address/AddressController.java` | `getMemberInfo()` DTO 반환 |
| `storeMember/StoreMemberController.java` | `getCurrentUser()` DTO 반환, 409 응답 |
| `payment/PaymentController.java` | 검증 로직 TODO 주석 |
| `member/MemberService.java` | 중복 시 예외 발생 |
| `member/MemberController.java` | 409 Conflict 응답 |
| `storeMember/StoreMemberService.java` | `Optional.get()` 제거 |
| `SecurityConfig.java` | PUBLIC_URLS에 `/api/login` 추가 |
| `member/jwt/LoginFilter.java` | 경로 `/api/login` 변경 |

### Frontend

| 파일 | 변경 내용 |
|------|----------|
| `customerPage/Login.js` | Firebase npm import, `/api/login` 경로 |
| `utils/firebaseConfig.js` | **[NEW]** Firebase 초기화 유틸 |
| `package.json` | `firebase` 패키지 추가 확인 |

### 문서

| 파일 | 변경 내용 |
|------|----------|
| `SECURITY_TODO.md` | **[NEW]** HttpOnly Cookie 전환 계획 |
| `PERFORMANCE_HYPOTHESIS.md` | Toss 실결제 연동 가설 추가 |

---

## Out of Scope

- JWT → HttpOnly Cookie 전환 (별도 Plan)
- Toss Payments 실제 API 연동 (Secret Key 필요)
- 국세청 사업자등록번호 API 연동

---

## Verification Plan

### 1. Backend 빌드 테스트

```powershell
cd back-end
./gradlew build --no-daemon
```

**예상 결과**: `BUILD SUCCESSFUL`

### 2. Frontend 빌드 테스트

```powershell
cd front-end
npm run build
```

**예상 결과**: 빌드 성공, Firebase CDN import 관련 오류 없음

### 3. 통합 테스트 (수동)

1. **로그인 테스트**:
   - Backend: `./gradlew bootRun --no-daemon`
   - Frontend: `npm start`
   - 브라우저에서 `http://localhost:3000` 접속
   - 로그인 시도 → `/api/login` 경로로 요청 확인 (Network 탭)
   - 성공 시 토큰 발급 확인

2. **민감 정보 노출 테스트**:
   - 로그인 후 `/api/memberinfo` 호출 (Postman 또는 브라우저)
   - 응답에 `pw` 필드가 없는지 확인

3. **중복 회원가입 테스트**:
   - 동일 ID로 회원가입 2회 시도
   - 두 번째 요청에서 `409 Conflict` 응답 확인

---

## Notes

- 모든 문서 인코딩: UTF-8
- 커밋 컨벤션: `fix(security): DTO로 민감정보 노출 방지`
