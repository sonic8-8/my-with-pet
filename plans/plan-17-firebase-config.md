# Plan-17: ADR-006 Firebase Config 환경변수 분리

> **Phase**: 3B (Security - Frontend)  
> **생성일**: 2026-01-14  
> **완료일**: 2026-01-14  
> **상태**: ✅ 완료  
> **관련 ADR**: ADR-006 (토큰 저장)과 연계

---

## 목표

`Login.js`에 하드코딩된 Firebase Config를 환경변수로 분리합니다.

---

## 현재 상태

```javascript
// Login.js
const firebaseConfig = {
    apiKey: "AIzaSyA84xPtsglofD_O6n71ZUTUFSeA95IVbU0",  // 하드코딩됨
    authDomain: "flowing-code-427002-h8.firebaseapp.com",
    projectId: "flowing-code-427002-h8",
    // ...
};
```

**문제**: Firebase API Key가 소스코드에 직접 노출됨

---

## 구현 체크리스트

### 1. 환경변수 분리

- [ ] **1.1** `.env.example`에 Firebase 환경변수 템플릿 추가
  ```
  REACT_APP_FIREBASE_API_KEY=your_api_key
  REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
  REACT_APP_FIREBASE_PROJECT_ID=your_project_id
  REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  REACT_APP_FIREBASE_APP_ID=your_app_id
  REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
  ```

- [ ] **1.2** `Login.js` 수정 - 환경변수 사용

### 2. 검증

- [ ] **2.1** ESLint 통과 확인

---

## 완료 기준

1. ✅ Firebase Config 환경변수 분리
2. ✅ ESLint 통과
