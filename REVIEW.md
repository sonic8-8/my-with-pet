# Code Review Summary (Back-end & Front-end)

이 문서는 지금까지 검토한 back-end / front-end 코드리뷰 내용을 통합 정리한 결과입니다.\
(경로: 프로젝트 최상위 `REVIEW.md`)

## Back-end 리뷰 요약

### 1) 치명/높음
- 빌드 실패 가능
  - `MyExceptionHandler`의 문자열 리터럴이 닫히지 않아 컴파일 오류 발생 가능
  - 경로: `back-end/src/main/java/com/apple/shop/MyExceptionHandler.java`
- 인증/권한 전면 실패 가능
  - `hasAnyRole("USER", "BUSINESS")` 적용하지만 실제 저장/발급되는 역할은 `user`/`ceo`이고 `ROLE_` prefix도 없음
  - 결과적으로 보호된 엔드포인트 접근이 전부 403/401이 될 수 있음
  - 경로: `back-end/src/main/java/com/apple/shop/SecurityConfig.java`, `back-end/src/main/java/com/apple/shop/member/MemberService.java`, `back-end/src/main/java/com/apple/shop/storeMember/StoreMemberService.java`, `back-end/src/main/java/com/apple/shop/member/CustomUserDetails.java`
- 공개 URL/실제 엔드포인트 불일치
  - 공개 URL은 `/api/register`인데 실제 컨트롤러는 `/api/sign-up`
  - `/api/business/**` 전체가 보호 대상이라 사업자 로그인/가입도 막힐 수 있음
  - 경로: `back-end/src/main/java/com/apple/shop/SecurityConfig.java`, `back-end/src/main/java/com/apple/shop/member/MemberController.java`, `back-end/src/main/java/com/apple/shop/storeMember/StoreMemberController.java`
- JWT 만료 시간 단위 오류
  - `createJwt`는 ms를 기대하지만 `LoginFilter`가 seconds를 넘겨 36초 만에 만료될 수 있음
  - 경로: `back-end/src/main/java/com/apple/shop/member/jwt/LoginFilter.java`
- 잘못된 토큰 처리 시 500 가능
  - `JWTFilter`에서 서명/만료 오류 예외 처리 없음
  - 경로: `back-end/src/main/java/com/apple/shop/member/jwt/JWTFilter.java`
- 주문/장바구니 IDOR 위험
  - 주문 이력 조회가 `userId`를 바디에서 받음, 존재하지 않으면 `.get()`으로 500
  - 장바구니 저장 시 요청 바디로 `memberId`를 받음 → 타 사용자 데이터 가능
  - 경로: `back-end/src/main/java/com/apple/shop/orders/OrdersController.java`, `back-end/src/main/java/com/apple/shop/cart/CartController.java`, `back-end/src/main/java/com/apple/shop/cart/Cart.java`

### 2) 중간
- 사업자 로그인 플로우 미완
  - `SecurityContextHolder` 사용하지만 JWT 발급/세션 설정 없음
  - 경로: `back-end/src/main/java/com/apple/shop/storeMember/StoreMemberController.java`
- `/mypage` 및 `/memberinfo` 예외가 500으로 반환될 수 있음
  - 경로: `back-end/src/main/java/com/apple/shop/member/MemberController.java`, `back-end/src/main/java/com/apple/shop/address/AddressController.java`
- 중복 가입 시 성공 응답 반환 가능
  - 경로: `back-end/src/main/java/com/apple/shop/member/MemberService.java`, `back-end/src/main/java/com/apple/shop/member/MemberController.java`
- 매장 목록/상세 조회 파라미터 누락 시 의도치 않은 결과 또는 500 가능
  - `type`/`idx`가 null일 때 `findAllByType(null)` 또는 `findByIdx(null)` 실행
  - 경로: `back-end/src/main/java/com/apple/shop/store/StoreController.java`, `back-end/src/main/java/com/apple/shop/store/StoreRepository.java`
- 사업자 정보 조회 시 존재하지 않는 ID로 500 가능
  - `findById(id).get()` 사용으로 NoSuchElementException 발생 가능
  - 경로: `back-end/src/main/java/com/apple/shop/storeMember/StoreMemberService.java`

### 3) 기타
- `JWTUtil.resolveToken` 사용처 없음
  - 경로: `back-end/src/main/java/com/apple/shop/member/jwt/JWTUtil.java`


## Front-end 리뷰 요약

### 1) 치명/높음
- JSX 문법 오류로 빌드 실패
  - 닫는 태그에서 `<` 누락: `</h1>`, `</label>`, `</button>`, `</p>` 등
  - 경로: `front-end/src/customerPage/Login.js`, `front-end/src/businessPage/BizLogin.js`, `front-end/src/customerPage/SignUp.js`, `front-end/src/businessPage/BizSignUp.js`, `front-end/src/customerPage/Cart.js`
- 추가 JSX/문자열 문법 오류로 빌드 실패
  - 잘못된 닫는 태그/문자열로 JSX 파싱 불가
  - 경로: `front-end/src/customerPage/Main.js`, `front-end/src/customerPage/Navbar.js`, `front-end/src/customerPage/StoreList.js`, `front-end/src/businessPage/BizNavbar.js`, `front-end/src/businessPage/BizSidebar.js`, `front-end/src/businessPage/BizItemEdit.js`, `front-end/src/Tosspayments/PaymentPage.js`, `front-end/src/Tosspayments/hooks/usePaymentWidget.js`
- Redux 스토어 파일 문법 오류로 빌드 실패
  - 따옴표/세미콜론 누락으로 파싱 불가, `extraReducers` 중복 선언도 존재
  - 경로: `front-end/src/Redux/store.js`
- CRA/번들링 불가
  - Firebase SDK를 CDN URL로 import → 로컬 번들 환경에서 빌드 실패
  - 경로: `front-end/src/customerPage/Login.js`
- CSS 모듈 경로 불일치로 빌드 실패 가능
  - `PaymentPage.js`가 `./Payment.module.css`를 import하지만 동일 경로에 파일 없음
  - 경로: `front-end/src/Tosspayments/PaymentPage.js`

### 2) 중간
- 인증 토큰 저장/조회 불일치
  - 로그인은 쿠키 저장, axios 인터셉터는 localStorage만 읽음
  - 결과적으로 보호 API 호출 시 Authorization 누락 가능
  - 경로: `front-end/src/customerPage/Login.js`, `front-end/src/customerPage/hooks/useAuth.js`, `front-end/src/api/axiosConfig.js`
- 결제 API 경로 이중 `/api`
  - baseURL이 `/api`인데 요청도 `/api/...` → `/api/api/...` 호출
  - 경로: `front-end/src/api/axiosConfig.js`, `front-end/src/api/paymentApi.js`
- 주문 저장 API 경로 이중 `/api`
  - baseURL이 `/api`인데 요청도 `/api/order` → `/api/api/order` 호출
  - 경로: `front-end/src/Tosspayments/hooks/useOrderForm.js`
- 사업자 로그인 응답 포맷 불일치
  - 프론트는 `{message, token}` 기대, 백엔드는 문자열 반환 (현 상태 기준)
  - 경로: `front-end/src/businessPage/BizLogin.js`
- 주소 목록 조회 방식 불일치
  - FE는 `memberId` 쿼리로 호출, BE는 Authorization 헤더에서 토큰 추출
  - 결과적으로 주소 조회가 401/404로 실패 가능
  - 경로: `front-end/src/Redux/store.js`, `back-end/src/main/java/com/apple/shop/address/AddressController.java`

### 3) 낮음
- 주문 내역 userId 하드코딩
  - 경로: `front-end/src/mypage/OrderList.js`
- 주문 데이터 누락/중복 및 key 불일치
  - `recipientName` 누락, `orderMemo` 중복, `item.id` vs `item.idx` 혼용
  - 경로: `front-end/src/customerPage/Cart.js`
- 미사용 코드/중복 파일
  - `front-end/src/api/Success.js`는 라우팅에 사용되지 않음 (실제 사용은 `Tosspayments/Success.js`)
  - `front-end/src/customerPage/Login.js`의 `useCookies` 상태값 및 Firebase analytics 변수 미사용
  - `front-end/src/mypage/AddressEdit.js`의 `Cookies` import 미사용
  - `front-end/src/mypage/ProfileEdit.js`의 업데이트 로직 주석 처리


## Back-end ↔ Front-end 연동 이슈 요약

- 회원가입 공개 경로 불일치
  - FE: `/api/sign-up`, BE 공개 URL: `/api/register`
  - 결과: 인증 없이 호출 시 401 가능
- 주소 추가 경로 불일치
  - FE: `/api/address-add1`, BE: `/api/address-add`
  - 결과: 404
- 회원정보 조회 방식 불일치
  - FE: `/api/memberinfo` 바디에 `userid`, BE: Authorization 헤더에서 토큰 추출
- 주소 목록 조회 방식 불일치
  - FE: `/api/address?memberId=...`, BE: Authorization 헤더에서 토큰 추출
  - 결과: 401/404 가능
- 사업자 인증/가게 정보 저장 API 미구현
  - FE: `/api/business/verify`, `/api/business/storeinfo`
  - BE에 엔드포인트 없음 → 404
- 결제 확인/승인 API 미구현
  - FE: `/api/confirm`, `/api/v1/payment/confirm`
  - BE에 엔드포인트 없음 → 404
- 주문 저장 미구현
  - FE: `/api/order`로 전송, BE `SaveOrder` 비어 있음


## 불필요하거나 정리 후보 코드
- FE: 미사용/중복 컴포넌트
  - `front-end/src/api/Success.js`
- FE: 미사용 import/상태
  - `front-end/src/customerPage/Login.js` (`useCookies` 상태, Firebase analytics 변수)
  - `front-end/src/mypage/AddressEdit.js` (Cookies import)
- BE: 사용처 없는 유틸
  - `back-end/src/main/java/com/apple/shop/member/jwt/JWTUtil.java`의 `resolveToken`
- BE: 사용되지 않는 공개 경로 설정
  - `back-end/src/main/java/com/apple/shop/SecurityConfig.java`의 `/api/register`, `/api/main/**`


## SSR(서버사이드 렌더링) 제거 대상 정리

연습용 SSR(Thymeleaf) 관련 코드를 제거하기 위한 정리입니다.

### 현재 SSR 관련 흔적
- 의존성
  - `back-end/build.gradle`
    - `org.springframework.boot:spring-boot-starter-thymeleaf`
    - `org.thymeleaf.extras:thymeleaf-extras-springsecurity6`
- 템플릿 리소스
  - `back-end/src/main/resources/templates/` 전체
    - date.html, detail.html, edit.html, error.html, index.html, list.html, listPagination.html,
      login.html, mypage.html, nav.html, notice.html, ordersDetail.html, register.html,
      searchPagination.html, write.html
- 정적 리소스(SSR 페이지용)
  - `back-end/src/main/resources/static/`
    - cart.css, main.css, ordersDetail.css
- 주석/문서 흔적
  - `back-end/src/main/java/com/apple/shop/MyExceptionHandler.java` 하단 주석에 Thymeleaf 언급

### 현재 상태
- `@RestController` 중심이며 HTML 뷰를 반환하는 `@Controller`는 없음
- `application.yml`에 Thymeleaf 관련 설정 없음

### 제거 권장 목록
1) SSR 의존성 제거
   - `back-end/build.gradle`에서 아래 의존성 삭제
     - spring-boot-starter-thymeleaf
     - thymeleaf-extras-springsecurity6
2) 템플릿/정적 리소스 제거
   - `back-end/src/main/resources/templates/` 전체 삭제
   - `back-end/src/main/resources/static/` 내 SSR 전용 CSS 삭제
3) 참고 주석 정리(선택)
   - `MyExceptionHandler.java` 하단 주석 제거 또는 REST 전용 설명으로 변경

### 영향 범위
- REST API에는 영향 없음(현재 뷰 렌더링 경로 없음)
- SSR 페이지는 더 이상 제공되지 않음(현재 프론트는 SPA 기준)


## 보안/인증 책임 일원화 제안 (Spring Security)

- Spring Security를 사용하는 만큼 인증/인가 흐름은 Security 필터 체인에서 처리하도록 일원화하는 것이 권장됨.
- 현재 `/api/login` 컨트롤러와 `LoginFilter`가 공존하여 책임이 분산되어 있음.
- 정리 방향(권장):
  - `LoginFilter`가 `/api/login`을 처리하도록 설정하거나(필터 경로 통일)
  - 컨트롤러 기반 로그인 로직을 제거하고 Security 필터 기반으로 통일
- 기대 효과: 인증 로직 단일화, 보안 정책 일관성, 테스트/유지보수 단순화


## 추가 확인: 미완성/플레이스홀더 기능

### Front-end
- 비즈니스/마이페이지 일부 화면이 빈 컨테이너만 반환하는 상태(기능 미구현)
  - `front-end/src/businessPage/BizLikeList.js`
  - `front-end/src/businessPage/BizOrderList.js`
  - `front-end/src/businessPage/BizOrderStatus.js`
  - `front-end/src/businessPage/BizReview.js`
  - `front-end/src/businessPage/BizTempClose.js`
  - `front-end/src/mypage/DeleteId.js`
  - `front-end/src/mypage/Mypage.js`
  - `front-end/src/mypage/MyPet.js`
- BizMain 화면은 더미 텍스트/그래프 컨테이너만 있고 데이터 연동이 없음(기능 미완성)
  - `front-end/src/businessPage/BizMain.js`
- BizMain에 JSX 닫는 태그 오류가 포함되어 빌드 실패 가능
  - 예: `</p>` 누락 형태
  - `front-end/src/businessPage/BizMain.js`
- `front-end/src/mypage/LikeList.js`는 안내 문구만 존재(실제 목록 기능 없음)
- BizItemEdit 메뉴 추가 로직이 비어 있음
  - `addItem`에서 `items`에 `newItem`을 추가하지 않아 화면에 반영되지 않음
  - `front-end/src/businessPage/BizItemEdit.js`

### Back-end
- 서비스 레이어가 비어 있는 클래스 다수(비즈니스 로직 미구현)
  - `back-end/src/main/java/com/apple/shop/orders/OrdersService.java`
  - `back-end/src/main/java/com/apple/shop/cart/CartService.java`
  - `back-end/src/main/java/com/apple/shop/review/ReviewService.java`
  - `back-end/src/main/java/com/apple/shop/item/ItemService.java`
  - `back-end/src/main/java/com/apple/shop/address/AddressService.java`


## 의사결정 결과 (2026-01-15)

> Phase 6 진행을 위한 주요 결정사항

| 항목 | 결정 | 비고 |
|------|------|------|
| 역할(Role) 표준화 | **DB 저장 값 변경** | `user`→`ROLE_USER`, `ceo`→`ROLE_BUSINESS` |
| 토큰 저장 방식 | **HttpOnly Cookie** | Spring Security 표준 방식, XSS 방어 |
| 미완성 화면 | **"준비 중" UI 표시** | 라우팅 유지, Placeholder 컴포넌트 적용 |
| SSR(Thymeleaf) | **제거** | 의존성, 템플릿, 정적파일 삭제 |
| 미구현 BE API | **전부 구현** | `/api/confirm`, `/api/order` 등 |

**참고**: 상세 구현 계획은 `ROADMAP.md` Phase 6 참조
