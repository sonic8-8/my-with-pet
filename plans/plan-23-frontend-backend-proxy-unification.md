# Plan-23: Front-end ↔ Back-end Proxy 통일 작업

> **Phase**: 로컬 개발환경 정비 (Phase 5.4)  
> **생성일**: 2026-01-15  
> **완료일**: 2026-01-15  
> **상태**: ✅ 완료

---

## 목표

프론트엔드의 API 호출 경로를 상대 경로(`/api/...`)로 통일하고, `setupProxy.js`를 통해 백엔드 서버(`http://localhost:8080`)로 요청이 올바르게 전달되도록 설정합니다.

---

## 현재 문제

| 문제 | 상세 내용 |
|------|-----------|
| URL 하드코딩 | `http://localhost:8085/api/...` 등 하드코딩된 절대 경로가 산재함 |
| 포트 불일치 | 백엔드는 8080이나 프런트엔드 프록시 설정은 8085로 되어 있음 |
| 오타 URL | `http://localhost8085/...` (콜론 누락) 등 오타가 존재함 |
| 설정 분산 | API 기점이 상황에 따라 제각각임 |

---

## 구현 체크리스트

### 1. 프론트엔드 환경 설정 수정

- [x] **1.1** `setupProxy.js` 수정: `target: 'http://localhost:8080'`으로 변경
- [x] **1.2** `api/axiosConfig.js` 수정: `baseURL: '/api'`

### 2. 소스코드 내 하드코딩된 URL 수정 (상대경로화)

- [x] **2.1** `Redux/store.js`: 오타(`localhost8085`) 2건 및 절대경로 1건 수정
- [x] **2.2** customerPage 수정: `Main.js`, `Login.js`, `SignUp.js`, `Cart.js`, `StoreList.js`
- [x] **2.3** customerPage/hooks 수정: `useStoreData.js` (3건)
- [x] **2.4** mypage 수정: `AddressEdit.js`, `OrderList.js`, `ProfileEdit.js` (2건)
- [x] **2.5** businessPage 수정: `BizLogin.js`, `BizSignUp.js`, `BizNumAuth.js`, `BizMypage.js`
- [x] **2.6** businessPage/hooks 수정: `useStoreInfoForm.js`
- [x] **2.7** Tosspayments 수정: `Success.js`
- [x] **2.8** api 수정: `Success.js`

---

## 완료 기준

1. ✅ 모든 API 호출이 절대 경로가 아닌 상대 경로(`/api/...`)를 사용함
2. ✅ `setupProxy.js` 설정을 통해 로컬 백엔드 서버(8080)와 정상 통신 가능
3. ✅ 하드코딩된 8085 포트 및 오타 URL이 모두 제거됨
4. ✅ `localhost` 검색 시 `setupProxy.js`에만 존재 (정상)
