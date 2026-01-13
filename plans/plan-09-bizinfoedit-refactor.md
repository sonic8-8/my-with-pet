# Plan-09: Phase 2A - Frontend 가독성 리팩토링 (BizInfoEdit 분해)

> **Phase**: 2A (Frontend Readability - Fat Component Split)  
> **생성일**: 2026-01-13  
> **완료일**: 2026-01-13  
> **상태**: ✅ 완료

---

## 목표

`BizInfoEdit.js` (234줄) Fat 컴포넌트를 **작은 단위 컴포넌트**로 분해하고, **Custom Hook**을 추출하여 관심사를 분리합니다.

---

## 작업 체크리스트

### 1. Custom Hook 추출

- [x] **1.1** `useStoreInfoForm` Hook 생성 ✅
  - 12개 폼 상태를 단일 객체로 관리
  - 반환: `{ formState, handleChange, handlePhoneChange, handleSave }`

- [x] **1.2** `useImagePreview` Hook 생성 ✅
  - 이미지 미리보기 로직 추출
  - 반환: `{ previewUrl, imageFile, handleImageChange }`

### 2. 서브 컴포넌트 추출

- [x] **2.1** `NoticeInfoSection` 컴포넌트 생성 ✅
- [x] **2.2** `StoreInfoSection` 컴포넌트 생성 ✅
- [x] **2.3** `StoreLogoUploader` 컴포넌트 생성 ✅

### 3. BizInfoEdit 간소화

- [x] **3.1** 메인 컴포넌트 정리 ✅
  - 234줄 → **47줄**로 축소

---

## 리팩토링 결과

### 파일 구조 (After)
```
businessPage/
├── BizInfoEdit.js (47줄) - 메인 컴포넌트
├── components/
│   ├── NoticeInfoSection.js (31줄)
│   ├── StoreInfoSection.js (87줄)
│   └── StoreLogoUploader.js (20줄)
└── hooks/
    ├── useStoreInfoForm.js (98줄)
    └── useImagePreview.js (27줄)
```

### 리팩토링 통계
| 항목 | Before | After |
|------|--------|-------|
| BizInfoEdit.js 줄 수 | 234줄 | **47줄** |
| useState 호출 | 12개 | **0개** (Hook으로 이동) |
| Custom Hook | 0개 | **2개** |
| 서브 컴포넌트 | 0개 | **3개** |

### 검증 결과
- ESLint: 에러 없음 ✅

---

## 완료 기준 달성

1. ✅ `BizInfoEdit.js` 60줄 이하 (47줄)
2. ✅ Custom Hook 2개 추출 (useStoreInfoForm, useImagePreview)
3. ✅ 서브 컴포넌트 3개 추출
4. ✅ ESLint 검사 통과
