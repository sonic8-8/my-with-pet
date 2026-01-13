# ADR-005: StoreMember 인증 강화

> **상태**: 🟡 승인 대기  
> **생성일**: 2026-01-13  
> **결정자**: [사용자 승인 필요]

---

## 컨텍스트

현재 `/api/business/**` 엔드포인트에 대한 인증이 부재하거나 불완전합니다.

### 문제점
- 사업자 회원 전용 API가 무인가 접근 가능
- 가게 정보 수정, 상품 등록 등 민감한 작업이 보호되지 않음

### 심각도
🟡 **HIGH**

---

## 권장 결정

**ADR-001과 연계하여 RBAC 적용**

```java
http.authorizeHttpRequests(auth -> auth
    // ...
    .requestMatchers("/api/business/**").hasRole("BUSINESS")
    // ...
);
```

### 추가 조치
- StoreMember 로그인 시 `ROLE_BUSINESS` 권한 부여
- 사업자 API 호출 시 JWT 토큰 검증

---

## 구현 계획

1. ADR-001 구현 시 함께 적용
2. StoreMember 역할 추가
3. 사업자 API 테스트

---

## 승인 요청

**ADR-001 승인 시 함께 구현됩니다.**
