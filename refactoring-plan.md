# 레거시 프로젝트 리뷰 및 리팩토링 계획

## 주요 이슈(Findings)
- Critical: 인증이 사실상 비활성화됨. `SecurityConfig`에서 `/**`, `/api/**` 전체 허용.
- High: 로그인/토큰 흐름 불일치 (LoginFilter 헤더 토큰 vs `/api/login` 바디 토큰; 쿠키 지원은 있으나 미사용).
- High: `findById(...).get()`로 500 에러 가능성 다수 (member/orders/auth 등).
- High: 프론트 빌드 위험 (문법/인코딩 문제, `Redux/store.js` 오류, `http://localhost8085` 잘못된 URL).
- Medium: API 클라이언트 분산, 토큰 저장소 불일치 (Cookies vs localStorage).
- Medium: 운영 설정 리스크 (`ddl-auto: update`, `show-sql: true`), `gcp-key.json` 레포 포함.
- Low: 서비스 계층이 얕고 컨트롤러가 리포지토리를 직접 사용.
- Test gap: 핵심 흐름에 대한 백엔드/프론트 테스트 부족.

## 리팩토링 계획

### Phase 0: 빌드/인코딩/환경 안정화
- 프론트 문법 오류와 잘못된 URL 수정 (`front-end/src/Redux/store.js`).
- 파일 인코딩을 UTF-8로 통일하고 깨진 주석/문자열 정리 (예: `front-end/src/App.js`).
- `gcp-key.json` 레포 분리, 환경 변수/시크릿 매니저 사용.

### Phase 1: 인증/보안 정리
- 로그인 플로우 통일: `/api/login` 또는 `LoginFilter` 중 하나만 유지.
- 토큰 전달 방식(헤더 vs 쿠키) 통일.
- `SecurityConfig`에서 공개 엔드포인트만 허용, 나머지 인증 필요.
- `findById().get()` 제거, `orElseThrow` + 적절한 상태 코드 반환.

### Phase 2: 서비스 계층 정비
- 컨트롤러 로직을 서비스로 이동.
- 입력 검증(`@Valid`) 도입, 엔티티 직접 노출 최소화.
- `@Transactional` 적용.

### Phase 3: 프론트 구조 정리
- 단일 API 클라이언트(`axiosConfig`)로 통일.
- 토큰 저장/인터셉터 동작 일관화.
- Redux slice 정리, 비동기 처리 중복 제거.
- 라우팅 분리 및 lazy loading 고려.

### Phase 4: 테스트/운영 품질
- 백엔드: 인증/주문/카트 통합 테스트 추가.
- 프론트: 로그인/장바구니/결제 테스트 추가.
- prod에서 `ddl-auto`, `show-sql` 제거, 로깅/모니터링 강화.
