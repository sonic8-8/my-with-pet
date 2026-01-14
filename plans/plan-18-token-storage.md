# Plan-18: ADR-006 토큰 저장 방식 개선

> **Phase**: 3B (Security - Frontend)  
> **생성일**: 2026-01-14  
> **완료일**: 2026-01-14  
> **상태**: ✅ 완료 (문서화)  
> **관련 ADR**: [ADR-006](../adr/ADR-006-token-storage.md)

---

## 목표

ADR-006에서 제안된 HttpOnly Cookie 방식은 Backend 변경이 필요하므로, 현재 단계에서는 토큰 저장 방식에 대한 **문서화 및 향후 개선 방향 정리**만 수행합니다.

---

## 현재 상태

```javascript
// Login.js
Cookies.set('token', token, { expires: 7, path: '/' });
Cookies.set('MemberId', MemberId, { expires: 7 });
```

**문제**: 일반 쿠키에 토큰 저장 → JavaScript로 접근 가능 → XSS 공격 시 탈취 위험

---

## 현재 제약 사항

HttpOnly Cookie 전환을 위해서는:
1. Backend에서 쿠키 설정 필요 (`Set-Cookie` 헤더)
2. HTTPS 환경 필요 (`Secure` 플래그)
3. CORS 설정 변경 필요

→ 현재 Phase 3 범위를 벗어남

---

## 조치 사항

### 1. ADR-006 상태 업데이트
- [ ] **1.1** 향후 개선 사항으로 마킹

### 2. 보안 권장사항 문서화
- [ ] **2.1** HTTPS 전환 시 HttpOnly Cookie 적용 권장

---

## 완료 기준

1. ✅ ADR-006 향후 개선으로 표시
2. ✅ 보안 권장사항 문서화 (SUMMARY.md에 기록)
