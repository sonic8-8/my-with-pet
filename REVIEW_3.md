# REVIEW_3.md - Pre-Deploy Code Review (Portfolio)

> 목적: GCP 배포 전에 오류/리스크를 최대한 제거하고, 부하테스트의 신뢰도를 확보한다.
> 기준: 실무 기준 + 포트폴리오 품질(보안/신뢰성/재현성).

---

## 0) 요약 (배포 전 반드시 차단)

1) **보안/인증/결제**
- 비밀번호/계정 정보가 API 응답으로 노출됨
- 결제 확인 API가 검증 없이 항상 성공
- JWT를 JS에서 읽을 수 있는 쿠키로 저장

2) **배포/빌드 실패 요인**
- CRA에서 CDN ESM Firebase import 사용 (빌드 실패 가능)
- 로그인 경로와 프록시/보안 정책 불일치

3) **기능 오류**
- 중복 회원가입이 실패를 감지하지 못하고 성공처럼 보일 수 있음
- 일부 서비스에서 Optional.get() 사용으로 런타임 예외 가능

---

## 1) 보안/인증/결제 (최우선)

### 1-1. 민감 정보 노출 (비밀번호 해시 포함)
- **근거 파일**
  - `back-end/src/main/java/com/apple/shop/address/AddressController.java:149`
  - `back-end/src/main/java/com/apple/shop/member/Member.java:31`
  - `back-end/src/main/java/com/apple/shop/storeMember/StoreMemberController.java:35`
  - `back-end/src/main/java/com/apple/shop/storeMember/StoreMemberUserDetails.java:26`
- **문제**
  - `/api/memberinfo`가 `Member` 엔티티를 그대로 반환 → `pw` 필드 노출 위험
  - `/api/business/current-user`가 `UserDetails`를 그대로 반환 → 비밀번호 필드가 직렬화될 수 있음
- **수정 가이드**
  1) 컨트롤러 응답을 **DTO로 변경** (비밀번호, 내부 식별자 제외)
  2) `@JsonIgnore`를 `pw` 필드에 적용하거나, `UserDetails` 반환 자체를 금지
  3) `/current-user`는 최소 정보만 반환하는 DTO 사용

---

### 1-2. 결제 검증 누락 (항상 성공 응답)
- **근거 파일**
  - `back-end/src/main/java/com/apple/shop/payment/PaymentController.java:23`
- **문제**
  - 요청 데이터만 받고 성공 응답 → 임의 결제 성공 처리 가능
- **수정 가이드**
  1) Toss Payments API에 **서버-서버 검증 요청** 수행
  2) 주문 금액/주문 ID **서버 DB 기준으로 검증**
  3) 성공 응답은 Toss 검증 성공 후에만 반환

---

### 1-3. JWT 저장 방식 (XSS 탈취 위험)
- **근거 파일**
  - `front-end/src/customerPage/Login.js:71`
  - `front-end/src/api/axiosConfig.js:15`
- **문제**
  - JS 접근 가능한 쿠키에 토큰 저장 → XSS 시 탈취 가능
- **수정 가이드**
  1) 서버에서 `HttpOnly` 쿠키로 발급
  2) 프론트는 토큰을 직접 읽지 않고 **자동 전송되는 쿠키**를 활용
  3) 서버 CORS에서 `allowCredentials(true)` 유지, 프론트는 `withCredentials: true` 설정

---

## 2) 배포/빌드 실패 요인 (차단 필수)

### 2-1. CRA 환경에서 CDN ESM import 사용
- **근거 파일**
  - `front-end/src/customerPage/Login.js:6`
- **문제**
  - CRA는 URL import를 지원하지 않음 → 빌드 실패 가능
- **수정 가이드**
  1) `firebase`를 `package.json`에 추가
  2) `import { initializeApp } from 'firebase/app'` 형식으로 교체
  3) 환경변수(`REACT_APP_...`) 기반으로 초기화

---

### 2-2. 로그인 경로 불일치
- **근거 파일**
  - `front-end/src/customerPage/Login.js:63`
  - `front-end/src/setupProxy.js:5`
  - `back-end/src/main/java/com/apple/shop/SecurityConfig.java:105`
- **문제**
  - 프록시는 `/api`만 전달함 → `/login`은 프론트 서버로 가서 실패
- **수정 가이드 (실무 권장)**
  1) 로그인 경로를 `/api/login`으로 통일
  2) Spring Security 로그인 필터 경로도 `/api/login`으로 변경
  3) `PUBLIC_URLS`에 `/api/login`을 포함

---

## 3) 기능 오류 (주요 플로우 안정화)

### 3-1. 중복 회원가입 처리
- **근거 파일**
  - `back-end/src/main/java/com/apple/shop/member/MemberService.java:23`
  - `back-end/src/main/java/com/apple/shop/member/MemberController.java:19`
- **문제**
  - 기존 사용자면 `return`으로 빠져서 컨트롤러는 성공처럼 응답
- **수정 가이드**
  1) `registerMember`에서 중복 시 예외 또는 결과 코드 반환
  2) 컨트롤러에서 `409 Conflict`로 명시적 응답

---

### 3-2. Optional.get() 사용
- **근거 파일**
  - `back-end/src/main/java/com/apple/shop/storeMember/StoreMemberService.java:51`
- **문제**
  - 데이터 없을 때 `NoSuchElementException` 발생
- **수정 가이드**
  1) `orElseThrow()`로 명확한 예외 처리
  2) 컨트롤러에서 `404 Not Found` 반환

---

## 4) 권장 적용 순서 (배포 전 최소 오류 전략)

1) **보안/결제 관련 차단** (1-1, 1-2, 1-3)
2) **빌드/배포 실패 요인 제거** (2-1, 2-2)
3) **기능 안정화** (3-1, 3-2)

---

## 5) 부하테스트 전에 확인할 체크리스트

- [ ] `/api/login` 정상 동작 (프록시 및 Security 설정 정합성)
- [ ] JWT 전달 방식 확정 (HttpOnly Cookie 권장)
- [ ] 결제 confirm API는 실검증 혹은 모킹 정책 명확화
- [ ] 빌드 성공 및 Cloud Run 배포 가능 상태 확보

---

## 6) 다음 단계 제안

- 위 항목 수정 후, **Phase 7~8 (Docker + GCP 배포)** 진행
- 배포 후 **Phase 9 (K6 + Grafana)**로 부하테스트 실행
- 테스트 결과 기반으로 Phase 10 최적화 수행
