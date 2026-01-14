# Performance Hypothesis

> 성능 최적화 가설 문서  
> 마지막 업데이트: 2026-01-14

이 문서는 프로젝트에서 식별된 **성능 개선 가설**을 기록합니다.  
**가설만 기록하며, 구현은 프로파일링 결과를 기반으로 추후 결정합니다.**

---

## Backend 성능 가설

### 4.1 페이지네이션 미적용 API 부하

**출처**: REVIEW_BE.md [Performance]

**현재 상태**:
- 리스트 조회 API에서 전체 데이터를 한 번에 반환
- 예: `/api/store-list`, `/api/orders/orderhistory`

**가설**:
- 데이터 증가 시 응답 시간 및 메모리 사용량 급증
- DB 쿼리 시간 증가로 전체 응답 지연

**권장 개선**:
```java
@GetMapping("/store-list")
public Page<Store> getStoreList(Pageable pageable) {
    return storeRepository.findAll(pageable);
}
```

**우선순위**: 🟡 MEDIUM  
**구현 시점**: 데이터 1000건 이상 시 프로파일링 후 결정

---

### 4.2 JPA LOB 컬럼 불필요 페치

**출처**: REVIEW_BE.md [Performance]

**현재 상태**:
- BLOB/CLOB 컬럼이 기본적으로 EAGER 페치로 설정될 수 있음
- 이미지, 텍스트 등 대용량 데이터 포함

**가설**:
- 리스트 조회 시 불필요한 LOB 데이터 로드로 메모리 낭비
- 네트워크 전송량 증가

**권장 개선**:
```java
@Lob
@Basic(fetch = FetchType.LAZY)
private byte[] image;
```

**우선순위**: 🟡 MEDIUM  
**구현 시점**: 메모리 프로파일링 후 결정

---

### 4.3 콘솔 로깅 I/O 병목

**출처**: REVIEW_BE.md [Performance]

**현재 상태**:
- Plan-15에서 대부분의 `System.out.println` 제거 완료
- 남은 로깅은 프레임워크 로거 사용

**가설**:
- 동기식 콘솔 출력은 I/O 블로킹 유발
- 고부하 환경에서 응답 지연 원인

**현재 상황**: ✅ 대부분 해결됨 (Plan-15)

**추가 권장**:
- AsyncAppender 사용 (Logback)
- 프로덕션에서 DEBUG 레벨 비활성화

**우선순위**: 🟢 LOW (이미 조치됨)

---

## Frontend 성능 가설

### 4.4 App.js 글로벌 상태 리렌더

**출처**: REVIEW_FE.md [Performance]

**현재 상태**:
- App.js에서 `mode` 상태 관리
- 상태 변경 시 전체 컴포넌트 트리 리렌더링 가능

**가설**:
- 불필요한 하위 컴포넌트 리렌더링으로 성능 저하
- 복잡한 UI에서 프레임 드롭 발생 가능

**권장 개선**:
```jsx
const MemoizedChild = React.memo(ChildComponent);
```

**우선순위**: 🟡 MEDIUM  
**구현 시점**: React DevTools Profiler 분석 후 결정

---

### 4.5 StoreDetail useEffect 루프 위험

**출처**: REVIEW_FE.md [Performance]

**현재 상태**:
- Plan-06에서 `useStoreData` Hook으로 리팩토링
- 의존성 배열 설정 완료

**가설**:
- 의존성 배열 누락 시 무한 API 호출 루프 발생
- 서버 과부하 및 클라이언트 프리징

**현재 상황**: ✅ 리팩토링으로 개선됨 (Plan-06)

**우선순위**: 🟢 LOW (이미 조치됨)

---

### 4.6 Redux 셀렉터 미최적화

**출처**: REVIEW_FE.md [Performance]

**현재 상태**:
- `useSelector`로 직접 상태 접근
- 메모이제이션 없음

**가설**:
- 스토어 업데이트 시 불필요한 컴포넌트 리렌더링
- 대규모 상태에서 성능 저하

**권장 개선**:
```jsx
import { createSelector } from '@reduxjs/toolkit';

const selectCartItems = createSelector(
  state => state.cart.items,
  items => items.filter(item => item.quantity > 0)
);
```

**우선순위**: 🟡 MEDIUM  
**구현 시점**: Redux DevTools 분석 후 결정

---

## 요약

| # | 가설 | 상태 | 우선순위 |
|---|------|------|---------|
| 4.1 | 페이지네이션 미적용 | 📋 문서화 | 🟡 MEDIUM |
| 4.2 | JPA LOB 불필요 페치 | 📋 문서화 | 🟡 MEDIUM |
| 4.3 | 콘솔 로깅 I/O | ✅ 해결됨 | 🟢 LOW |
| 4.4 | 글로벌 상태 리렌더 | 📋 문서화 | 🟡 MEDIUM |
| 4.5 | useEffect 루프 | ✅ 해결됨 | 🟢 LOW |
| 4.6 | Redux 셀렉터 | 📋 문서화 | 🟡 MEDIUM |

---

## 다음 단계

성능 최적화가 필요한 경우:
1. 프로파일링 도구로 병목 지점 측정
2. 가설 검증 후 구현 결정
3. A/B 테스트로 개선 효과 확인
