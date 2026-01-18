# Code Review Summary (Containerization Readiness)

이 문서는 Docker 컨테이너화 전에 확인한 코드/구성의 리스크를 요약한 리뷰입니다.
대상: `back-end`, `front-end`, `docker-compose.yml`.

## 1) 치명/높음

- 백엔드 이미지 빌드 실패 가능
  - `back-end/Dockerfile`은 `build/libs/*.jar`만 복사하며 빌드 단계가 없음.
  - JAR 미생성 상태에서 `docker build` 시 COPY 단계에서 실패.
  - 경로: `back-end/Dockerfile:5-6`

- 프론트-백엔드 연동 실패 가능 (컨테이너 환경)
  - 프론트는 `/api`를 기본 baseURL로 사용.
  - 개발용 프록시(`setupProxy.js`)는 CRA dev 서버에서만 동작하므로 Nginx 정적 서빙 환경에서 API 프록시가 없음.
  - 결과: 컨테이너에서 `/api` 요청이 404 또는 프록시 실패.
  - 경로: `front-end/src/api/axiosConfig.js:4-6`, `front-end/src/setupProxy.js:1-8`, `front-end/Dockerfile:1-6`

- 사업자 로그인 플로우 불완전
  - `/api/business/login`은 문자열만 반환하고 JWT 발급이 없음.
  - `/api/business/**`는 보호 경로이며 토큰이 없으면 접근 불가.
  - 결과: 사업자 전용 API에 접근할 방법이 없음.
  - 경로: `back-end/src/main/java/com/apple/shop/storeMember/StoreMemberController.java:33-42`, `back-end/src/main/java/com/apple/shop/SecurityConfig.java:84-89`

- prod 실행 시 JWT 설정 누락 가능
  - `application.yml`의 prod 프로필은 `JWT_SECRET`을 요구.
  - `docker-compose.yml`에 `JWT_SECRET` 환경 변수가 없어 컨테이너 기동 실패 가능.
  - 경로: `back-end/src/main/resources/application.yml:36-37`, `docker-compose.yml:8-15`

## 2) 중간

- 사용자 인증 실패 시 500으로 떨어질 수 있음
  - `CustomUserDetailsService`에서 `findById(...).get()`을 사용.
  - 존재하지 않는 ID일 때 `NoSuchElementException` 발생.
  - 경로: `back-end/src/main/java/com/apple/shop/member/CustomUserDetailsService.java:16-23`

- 주소 관련 FE/BE 계약 불일치 및 프론트 비동기 오류
  - FE는 `memberId` 쿼리를 보내고 Authorization 헤더 없이 조회.
  - BE는 Authorization 헤더에서 JWT를 추출하는 구조.
  - `asyncAddAddress`는 `await` 없이 `response.status`를 확인.
  - Redux `extraReducers`가 중복 선언되어 앞 블록이 덮어쓰기 됨.
  - 경로: `front-end/src/Redux/store.js:22-34`, `front-end/src/Redux/store.js:45-55`, `front-end/src/Redux/store.js:126-155`, `back-end/src/main/java/com/apple/shop/address/AddressController.java:38-44`

## 3) 참고/기타

- 로그인 경로/방식이 이중화됨
  - `/api/login` 컨트롤러와 `LoginFilter`가 공존하여 책임 분산.
  - 인증 흐름 단일화 필요.

## 컨테이너화 전 최소 수정 체크리스트

- 백엔드 Dockerfile에 빌드 단계 추가(Gradle build 포함) 또는 빌드 산출물 사전 생성.
- 프론트 Nginx에 `/api` 리버스 프록시 설정 또는 `REACT_APP_API_URL`로 외부 API 주소 명시.
- `docker-compose.yml`에 `JWT_SECRET` 추가.
- 사업자 로그인에 JWT 발급 로직 추가 또는 보호 경로 정책 조정.

## 테스트 제안

- `docker compose up --build`로 실제 빌드/기동 확인.
- 프론트에서 `/api` 호출 시 200 응답 확인(프록시/라우팅 정상 여부).
- 사업자 계정 로그인 후 `/api/business/...` 접근 확인.

---

추가로 기존 상세 리뷰는 `REVIEW.md` 참고.
