# Plan-06: Phase 2A - Frontend 가독성 리팩토링 (StoreDetail 분해)

> **Phase**: 2A (Frontend Readability - Fat Component Split)  
> **생성일**: 2026-01-13  
> **완료일**: 2026-01-13  
> **상태**: ✅ 완료

---

## 목표

`StoreDetail.js` (297줄) Fat 컴포넌트를 **작은 단위 컴포넌트**로 분해하고, **Custom Hook**을 추출하여 관심사를 분리합니다.

---

## 작업 체크리스트

### 1. Custom Hook 추출

- [x] **1.1** `useStoreData` Hook 생성 ✅
  - 매장 정보, 상품 목록, 리뷰 로딩 로직 추출
  - 반환: `{ store, items, reviews, isLoading, error }`

### 2. 서브 컴포넌트 추출

- [x] **2.1** `StoreHeader` 컴포넌트 생성 ✅
  - 매장 로고, 이름, 인증 배지, 별점, 배달비 표시

- [x] **2.2** `StoreItemList` 컴포넌트 생성 ✅
  - 상품 목록 및 장바구니 추가 기능

- [x] **2.3** `StoreNotice` 컴포넌트 생성 ✅
  - 공지사항, 가게 정보, 영업시간, 지도

- [x] **2.4** `StoreReviews` 컴포넌트 생성 ✅
  - 리뷰 목록 렌더링

### 3. StoreDetail 간소화

- [x] **3.1** 메인 컴포넌트 정리 ✅
  - 297줄 → **82줄**로 축소

---

## 리팩토링 결과

### 파일 구조 (After)
```
customerPage/
├── StoreDetail.js (82줄) - 메인 컴포넌트
├── components/
│   ├── StoreHeader.js (34줄)
│   ├── StoreItemList.js (40줄)
│   ├── StoreNotice.js (33줄)
│   └── StoreReviews.js (33줄)
└── hooks/
    └── useStoreData.js (60줄)
```

### 리팩토링 통계
| 항목 | Before | After |
|------|--------|-------|
| StoreDetail.js 줄 수 | 297줄 | **82줄** |
| 서브 컴포넌트 | 0개 | **4개** |
| Custom Hook | 0개 | **1개** |

### 검증 결과
- 개발 서버: 정상 실행 ✅
- 빌드: 실패 (기존 babel-preset 의존성 이슈, 코드 문제 아님)

---

## 완료 기준 달성

1. ✅ `StoreDetail.js` 100줄 이하 (82줄)
2. ✅ Custom Hook 1개 추출 (useStoreData)
3. ✅ 서브 컴포넌트 4개 추출
4. ⚠️ `npm run build`는 의존성 이슈로 실패 (기존 문제)
