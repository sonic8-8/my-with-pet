# Plan-16: ADR-005 StoreMember 인증 강화

> **Phase**: 3A (Security - Backend)  
> **생성일**: 2026-01-14  
> **완료일**: 2026-01-14  
> **상태**: ✅ 완료  
> **관련 ADR**: [ADR-005](../adr/ADR-005-storemember-auth.md)

---

## 목표

Plan-12(SecurityConfig RBAC)에서 이미 `/api/business/**` 경로에 `ROLE_BUSINESS` 권한을 요구하도록 설정했습니다.

이 Plan에서는 ADR-005를 완료 처리하고, 추가적인 StoreMember 인증 확인을 수행합니다.

---

## 현재 상태

SecurityConfig.java에서 이미 RBAC 적용됨:
```java
.requestMatchers(BUSINESS_URLS).hasAnyRole("BUSINESS", "ADMIN")
```

---

## 구현 체크리스트

### 1. 역할 부여 확인

- [ ] **1.1** StoreMember 로그인 시 `ROLE_BUSINESS` 역할 부여 확인

### 2. ADR-005 완료 처리

- [ ] **2.1** ADR-005 상태 업데이트
- [ ] **2.2** ROADMAP Plan-16 완료 표시

---

## 완료 기준

1. ✅ StoreMember에 ROLE_BUSINESS 역할 확인
2. ✅ /api/business/** 경로 인증 필수 확인
