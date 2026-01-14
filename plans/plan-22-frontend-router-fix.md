# Plan-22: 프론트엔드 라우팅 오류 수정

> **Phase**: 로컬 개발환경 정비 (Phase 5)  
> **생성일**: 2026-01-14  
> **완료일**: 2026-01-14  
> **상태**: ✅ 완료

---

## 목표

React Router v6에서 `<Routes>`의 직계 자식으로 커스텀 컴포넌트를 사용할 수 없는 구조적 결함을 해결하여 프론트엔드 서버를 정상적으로 구동시킵니다.

---

## 현재 문제

| 문제 | 원인 |
|------|------|
| `Invalid children of <Routes>` | `<Routes>` 내부에 `<CustomerRoutes />` 등 커스텀 컴포넌트 직접 사용 |
| 실행 실패 | React Router v6는 `<Routes>`의 자식으로 `<Route>` 또는 `<Fragment>`만 허용 |

---

## 구현 체크리스트

### 1. 전역 Route 컴포넌트 수정 (JSX Fragment 형태로 변경)

- [x] **1.1** `CustomerRoutes.js` 수정: 컴포넌트에서 변수(Fragment) 형태로 변경
- [x] **1.2** `BusinessRoutes.js` 수정: 컴포넌트에서 변수(Fragment) 형태로 변경
- [x] **1.3** `PaymentRoutes.js` 수정: 컴포넌트에서 변수(Fragment) 형태로 변경

### 2. App.js 수정

- [x] **2.1** `<Routes>` 자식 호출 방식 변경: `<CustomerRoutes />` → `{CustomerRoutes}`

---

## 검증 계획

```bash
cd front-end
npm start
```

- 브라우저 콘솔 오류(`Invalid children of <Routes>`) 발생 여부 확인
- `/`, `/checkout`, `/business` 등 주요 경로 접근 시 정상 렌더링 확인

---

## 완료 기준

1. ✅ `npm start` 시 런타임 라우팅 오류 미발생
2. ✅ 모든 서비스 경로 정상 접근 가능
