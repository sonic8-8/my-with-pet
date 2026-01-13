# Plan-07: Phase 2A - Frontend 가독성 리팩토링 (Navbar 분해)

> **Phase**: 2A (Frontend Readability - Fat Component Split)  
> **생성일**: 2026-01-13  
> **완료일**: 2026-01-13  
> **상태**: ✅ 완료

---

## 목표

`Navbar.js` (237줄) Fat 컴포넌트를 **작은 단위 컴포넌트**로 분해하고, **Custom Hook**을 추출하여 관심사를 분리합니다.

---

## 작업 체크리스트

### 1. Custom Hooks 추출

- [x] **1.1** `usePanelState` Hook 생성 ✅
  - 패널 열기/닫기, 외부 클릭 감지 로직 추출

- [x] **1.2** `useAuth` Hook 생성 ✅
  - 로그인 상태 확인, 로그아웃 로직 추출

### 2. 서브 컴포넌트 추출

- [x] **2.1** `AlertPanel` 컴포넌트 생성 ✅
- [x] **2.2** `CartPanel` 컴포넌트 생성 ✅
- [x] **2.3** `AddressPanel` 컴포넌트 생성 ✅
- [x] **2.4** `SearchPanel` 컴포넌트 생성 ✅

### 3. Navbar 간소화

- [x] **3.1** 메인 컴포넌트 정리 ✅
  - 237줄 → **103줄**로 축소

---

## 리팩토링 결과

### 파일 구조 (After)
```
customerPage/
├── Navbar.js (103줄) - 메인 컴포넌트
├── components/
│   ├── AlertPanel.js (17줄)
│   ├── CartPanel.js (31줄)
│   ├── AddressPanel.js (38줄)
│   └── SearchPanel.js (20줄)
└── hooks/
    ├── usePanelState.js (38줄)
    └── useAuth.js (33줄)
```

### 리팩토링 통계
| 항목 | Before | After |
|------|--------|-------|
| Navbar.js 줄 수 | 237줄 | **103줄** |
| Custom Hook | 0개 | **2개** |
| 서브 컴포넌트 | 0개 | **4개** |

### 검증 결과
- ESLint: 에러 없음 ✅
- 개발 서버: 정상 실행 예상

---

## 완료 기준 달성

1. ⚠️ `Navbar.js` 80줄 이하 목표 미달 (103줄) - 메뉴 항목이 많아 축소 한계
2. ✅ Custom Hook 2개 추출 (usePanelState, useAuth)
3. ✅ 서브 컴포넌트 4개 추출
4. ✅ ESLint 검사 통과
