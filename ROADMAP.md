# Refactoring Roadmap - my-with-pet

> **문서 상태**: 진행 중  
> **마지막 업데이트**: 2026-01-13  
> **승인 상태**: ✅ 승인됨

---

## 개요

이 문서는 `REVIEW_BE.md`와 `REVIEW_FE.md`에서 식별된 이슈를 바탕으로 수립한 리팩토링 마일스톤입니다.  
**핵심 원칙**: 가독성 우선, 테스트 기반 리팩토링, 원자적 변경

---

## Phase 0: 기반 구축 (Foundation) ✅ 부분 완료

> 목표: 안전한 리팩토링을 위한 테스트 인프라 구축  
> **상태**: Backend 테스트 완료, Frontend 테스트 보류 (의존성 이슈)

| # | 작업 | 대상 파일/영역 | 우선순위 |
|---|------|---------------|---------|
| 0.1 | Backend 테스트 인프라 구축 | `back-end/src/test/` | 🔴 Critical |
| 0.2 | Frontend 테스트 인프라 구축 | `front-end/src/` (Jest + RTL) | 🔴 Critical |
| 0.3 | 핵심 서비스 단위 테스트 작성 | `MemberService`, `OrdersService`, `StoreMemberService` | 🔴 Critical |
| 0.4 | 핵심 컴포넌트 스모크 테스트 | `StoreDetail`, `Checkout`, `Navbar` | 🟡 High |

---

## Phase 1: Backend 가독성 리팩토링 ✅ 완료

> 목표: 20줄 이하 메서드, Composed Method 패턴 적용  
> **상태**: Phase 1A(메서드 분할) + Phase 1B(네이밍 개선) 완료  
> **System.out.println 제거**: 27개

### 1A. 긴 메서드 분할 (Split-First)

| # | 대상 메서드 | 현재 줄 수 | 분할 전략 |
|---|------------|-----------|----------|
| 1A.1 | `JWTFilter.doFilterInternal` | ~53줄 | `extractToken()`, `validateToken()`, `buildAuthContext()` 추출 |
| 1A.2 | `SecurityConfig.filterChain` | ~35줄 | `configureCors()`, `configureAuth()`, `configureFilters()` 추출 |
| 1A.3 | `AddressController.addAddress` | ~27줄 | 유효성 검증/매핑 로직 서비스로 이동 |
| 1A.4 | `StoreController.getStoreListByStoreIdx` | ~28줄 | DTO 변환 로직 분리 |
| 1A.5 | `ItemController.mainProduct` | ~29줄 | 조회/변환 책임 분리 |
| 1A.6 | `DistributedLockAop.lock` | ~27줄 | `acquireLock()`, `executeProceed()`, `releaseLock()` 추출 |
| 1A.7 | `MemberService.registerMember` | ~25줄 | `validateMember()`, `encodePassword()`, `saveMember()` 추출 |
| 1A.8 | `LoginFilter.attemptAuthentication` | ~21줄 | 파싱/인증 로직 분리 |

### 1B. 네이밍 개선

| # | 현재 이름 | 제안 이름 | 이유 |
|---|----------|----------|------|
| 1B.1 | `addAddress1` | `updateDefaultAddress` | 의도 명확화 |
| 1B.2 | `mainProduct` | `getProductsByType` | 라우트 의도 반영 |
| 1B.3 | `mainShop` | `getShopsByType` | 라우트 의도 반영 |
| 1B.4 | `getStoreListByStoreIdx` | `getStoreById` | 단일 객체 반환 반영 |
| 1B.5 | `List<Item> List` | `List<Item> items` | 타입명 섀도잉 제거 |

---

## Phase 2: Frontend 가독성 리팩토링 ✅ 완료

> 목표: Fat 컴포넌트 분해, Custom Hooks 추출  
> **상태**: Phase 2A 전체 완료 (5/5)

### 2A. Fat 컴포넌트 분해

| # | 대상 컴포넌트 | 추출할 요소 | 상태 |
|---|--------------|------------|------|
| 2A.1 | `StoreDetail.js` | `StoreHeader`, `StoreItemList`, `StoreNotice`, `StoreReviews`, `useStoreData` | ✅ 완료 |
| 2A.2 | `Checkout.js` | `OrderForm`, `CartItemsList`, `OrderSummary`, `usePaymentWidget`, `useOrderForm` | ✅ 완료 |
| 2A.3 | `Navbar.js` | `AlertPanel`, `CartPanel`, `AddressPanel`, `SearchPanel`, `usePanelState`, `useAuth` | ✅ 완료 |
| 2A.4 | `BizInfoEdit.js` | `NoticeInfoSection`, `StoreInfoSection`, `StoreLogoUploader`, `useStoreInfoForm`, `useImagePreview` | ✅ 완료 |
| 2A.5 | `App.js` | `CustomerRoutes`, `BusinessRoutes`, `PaymentRoutes` | ✅ 완료 |

### 2B. JSX 밀도 개선 ✅ 완료

> **상태**: Plan-06, Plan-07에서 함께 완료

| # | 대상 | 개선 방향 | 상태 |
|---|------|----------|------|
| 2B.1 | `StoreDetail.js` 탭 콘텐츠 | `StoreHeader`, `StoreItemList`, `StoreNotice`, `StoreReviews` 추출 | ✅ Plan-06 |
| 2B.2 | `Navbar.js` 패널 콘텐츠 | `AlertPanel`, `CartPanel`, `AddressPanel`, `SearchPanel` 추출 | ✅ Plan-07 |

---

## Phase 3: 보안 이슈 대응

> **⚠️ 승인 프로세스**: 보안 관련 변경은 시스템 동작에 큰 영향을 미치므로,  
> **ADR 작성 → 사용자 검토 → 승인 → 구현** 순서로 진행합니다.

### 3A. Backend 보안 (ADR 승인 후 구현)

| # | 이슈 | 심각도 | 대응 |
|---|------|--------|------|
| 3A.1 | `SecurityConfig` 전체 permitAll | 🔴 CRITICAL | ADR 작성 → 승인 후 수정 |
| 3A.2 | Address API IDOR | 🔴 CRITICAL | ADR 작성 → 승인 후 수정 |
| 3A.3 | 민감 정보 로깅 (JWT, 비밀번호) | 🟡 HIGH | 로깅 레벨 조정 제안 |
| 3A.4 | StoreMember 인증 부재 | 🟡 HIGH | ADR 작성 → 승인 후 수정 |

### 3B. Frontend 보안 (문서화 후 승인 필요)

| # | 이슈 | 심각도 | 대응 |
|---|------|--------|------|
| 3B.1 | OpenAI API Key 클라이언트 노출 | 🔴 CRITICAL | Backend Proxy 제안 → ADR |
| 3B.2 | Firebase Config 하드코딩 | 🟡 MEDIUM | 환경변수 분리 제안 |
| 3B.3 | LocalStorage 토큰 저장 | 🟡 MEDIUM | HttpOnly Cookie 전환 제안 → ADR |

---

## Phase 4: 성능 가설 기록

> **가이드라인 준수**: 성능 최적화는 구현하지 않고 `PERFORMANCE_HYPOTHESIS.md`에 기록

| # | 가설 | 출처 |
|---|------|------|
| 4.1 | 페이지네이션 미적용 API 부하 | `REVIEW_BE.md` [Performance] |
| 4.2 | JPA LOB 컬럼 불필요 페치 | `REVIEW_BE.md` [Performance] |
| 4.3 | 콘솔 로깅 I/O 병목 | `REVIEW_BE.md` [Performance] |
| 4.4 | App.js 글로벌 상태 리렌더 | `REVIEW_FE.md` [Performance] |
| 4.5 | StoreDetail useEffect 루프 위험 | `REVIEW_FE.md` [Performance] |
| 4.6 | Redux 셀렉터 미최적화 | `REVIEW_FE.md` [Performance] |

---

## 마일스톤 타임라인 (예상)

```
Phase 0 ████████████ 테스트 기반 구축 (BE 완료, FE 보류)
Phase 1 ████████████ Backend 가독성 ✅ 완료
Phase 2 ████████████ Frontend 가독성 ✅ 완료
Phase 3 ░░░░░░░░░░░░ 보안 대응 (승인 후)
Phase 4 ░░░░░░░░░░░░ 성능 가설 기록
```

---

## 다음 단계

1. [ ] 이 ROADMAP 승인
2. [ ] Phase 0 상세 계획 작성 (`plans/plan-01.md`)
3. [ ] `HISTORY.md` 초기화

---

## Appendix: 리뷰 문서 요약

### Backend 주요 이슈
- **보안**: permitAll 전역 적용, IDOR, 민감정보 로깅
- **가독성**: 20줄 초과 메서드 9개, 혼합된 추상화 수준
- **테스트**: contextLoads만 존재, 핵심 비즈니스 로직 미검증

### Frontend 주요 이슈
- **보안**: API 키 노출 (OpenAI, Firebase), localStorage 토큰
- **가독성**: Fat 컴포넌트 6개 (StoreDetail, Checkout, Navbar 등)
- **테스트**: CRA 기본 테스트만 존재, 상호작용 테스트 부재
