# Plan-26: FE-BE 연동 이슈 해결 (Phase 6B)

> **상태**: ✅ 완료  
> **생성일**: 2026-01-16  
> **관련**: ROADMAP.md Phase 6B, REVIEW.md

---

## 목표

Frontend와 Backend 간의 API 경로 불일치, 이중 /api 문제, 토큰 저장 방식 불일치를 해결합니다.

| # | 이슈 | 현재 상태 | 목표 상태 |
|---|------|----------|----------|
| 6B.1 | API 경로 표준화 | FE: `/api/address-add1`, BE: `/api/address-add` | 경로 통일 |
| 6B.2 | 이중 /api 경로 | `paymentApi.js`에서 `/api/v1/...` 호출 | `/v1/...`로 수정 |
| 6B.3 | 토큰 저장/조회 | Cookie 저장, localStorage 조회 | Cookie로 통일 |

---

## 현재 문제 분석

### 1. API 경로 불일치

| Frontend 호출 | Backend 엔드포인트 | 결과 |
|--------------|-------------------|------|
| `/api/address-add1` | `/api/address-add` | 404 |

**위치**: `front-end/src/mypage/AddressEdit.js` (Line 14)
```javascript
const response = await axios.post('/api/address-add1', {...})
```

---

### 2. 이중 /api 경로 문제

`axiosConfig.js`의 baseURL이 `/api`입니다:
```javascript
baseURL: process.env.REACT_APP_API_URL || '/api',
```

그런데 일부 파일에서 `/api/...` 경로를 사용하면:
- 요청: `/api` + `/api/v1/payment/confirm` = `/api/api/v1/payment/confirm` (❌)

**위치**:
| 파일 | 현재 | 수정 후 |
|------|------|--------|
| `paymentApi.js` (Line 5) | `/api/v1/payment/confirm` | `/v1/payment/confirm` |
| `useOrderForm.js` (Line 35) | `/api/order` | `/order` |

---

### 3. 토큰 저장/조회 불일치

**Login.js** (Line 69):
```javascript
Cookies.set('token', token, { expires: 7, path: '/' });
```

**axiosConfig.js** (Line 14):
```javascript
const token = localStorage.getItem('token');  // ❌ Cookie에서 읽어야 함
```

**결과**: 로그인 후에도 Authorization 헤더가 추가되지 않아 보호된 API 호출 실패

---

## 수정 계획

### 6B.1: API 경로 표준화

#### [MODIFY] AddressEdit.js

```diff
- const response = await axios.post('/api/address-add1', {
+ const response = await axios.post('/address-add', {
```

> 참고: `axiosConfig.js`의 baseURL이 `/api`이므로 `/address-add`만 사용

---

### 6B.2: 이중 /api 경로 수정

#### [MODIFY] paymentApi.js

```diff
- const response = await api.post('/api/v1/payment/confirm', {
+ const response = await api.post('/v1/payment/confirm', {
```

#### [MODIFY] useOrderForm.js

```diff
- const response = await api.post('/api/order', JSON.stringify(orderData));
+ const response = await api.post('/order', JSON.stringify(orderData));
```

---

### 6B.3: 토큰 저장/조회 통일 (Cookie 기반)

#### [MODIFY] axiosConfig.js

```diff
+ import Cookies from 'js-cookie';

  api.interceptors.request.use(
    (config) => {
-     const token = localStorage.getItem('token');
+     const token = Cookies.get('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
```

> **참고**: `js-cookie`는 이미 `Login.js`에서 사용 중이므로 추가 설치 불필요

---

## 검증 계획

### 빌드 테스트

```bash
cd front-end && npm run build
```

### 수동 검증, 실제 로그인/API 호출 테스트

1. **로그인 테스트**
   - Frontend 서버 시작: `cd front-end && npm start`
   - Backend 서버 시작: `cd back-end && ./gradlew bootRun`
   - 브라우저에서 `http://localhost:3000` 접속
   - 로그인 후 개발자 도구 > Application > Cookies에서 `token` 확인

2. **API 호출 테스트**
   - 로그인 후 마이페이지 > 주소 관리 접근
   - Network 탭에서 `/api/address` 요청에 Authorization 헤더 포함 확인
   - 주소 추가 시 `/api/address-add` 호출 확인 (404 없음)

---

## 영향 범위

| 파일 | 변경 내용 |
|------|----------|
| `AddressEdit.js` | `/api/address-add1` → `/address-add` |
| `paymentApi.js` | `/api/v1/payment/confirm` → `/v1/payment/confirm` |
| `useOrderForm.js` | `/api/order` → `/order` |
| `axiosConfig.js` | `localStorage.getItem` → `Cookies.get` |

---

## 의존성

- Plan-24 완료 필요 (JWT 토큰 정상 발급)
- Plan-25 완료 필요 (API 엔드포인트 정상 동작)

## 예상 소요 시간

- 구현: 15분
- 테스트: 15분
