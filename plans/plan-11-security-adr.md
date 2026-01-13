# Plan-11: Phase 3 - 보안 이슈 대응 ADR

> **Phase**: 3 (Security Response)  
> **생성일**: 2026-01-13  
> **상태**: 🔵 진행 중

---

## 목표

프로젝트에서 식별된 **CRITICAL/HIGH** 보안 이슈에 대한 **ADR(Architecture Decision Record)**을 작성하고, 승인 후 구현합니다.

---

## 보안 이슈 요약

### 🔴 CRITICAL (즉시 대응 필요)

| # | 이슈 | 영향 |
|---|------|------|
| 3A.1 | `SecurityConfig` 전체 `permitAll()` | 모든 API 인증 없이 접근 가능 |
| 3A.2 | Address API IDOR | 타인의 주소 정보 조회/수정 가능 |
| 3B.1 | OpenAI API Key 클라이언트 노출 | API 키 탈취 및 과금 피해 |

### 🟡 HIGH

| # | 이슈 | 영향 |
|---|------|------|
| 3A.3 | 민감 정보 로깅 | JWT, 비밀번호 로그 노출 |
| 3A.4 | StoreMember 인증 부재 | 사업자 API 무인가 접근 |
| 3B.3 | LocalStorage 토큰 저장 | XSS 공격 시 토큰 탈취 |

---

## ADR 작업 계획

### 1단계: CRITICAL 이슈 ADR 작성

- [ ] **ADR-001**: SecurityConfig 인증 정책 수립
  - 현재: `permitAll()` 전체 적용
  - 제안: 역할 기반 접근 제어 (RBAC) 도입
  
- [ ] **ADR-002**: Address API IDOR 취약점 해결
  - 현재: 쿼리 파라미터로 사용자 식별
  - 제안: JWT 토큰 기반 사용자 검증

- [ ] **ADR-003**: OpenAI API Key 보호
  - 현재: Frontend에서 직접 API 호출
  - 제안: Backend Proxy 도입

### 2단계: HIGH 이슈 ADR 작성

- [ ] **ADR-004**: 민감 정보 로깅 제거
- [ ] **ADR-005**: StoreMember 인증 강화
- [ ] **ADR-006**: 토큰 저장 방식 개선

---

## 다음 단계

1. ✅ 이 Plan 승인
2. ADR 문서 작성 (`adr/` 디렉토리)
3. 각 ADR 사용자 승인
4. 승인된 ADR 순차 구현

---

## 승인 요청

> [!IMPORTANT]
> **보안 이슈는 시스템 동작에 큰 영향을 미칩니다.**
>
> 각 ADR은 별도로 승인 프로세스를 거치며, 승인 후에만 구현됩니다.
> 특히 `SecurityConfig` 변경은 기존 API 호출에 영향을 줄 수 있으므로 신중한 검토가 필요합니다.

이 Plan을 승인하면 ADR 문서 작성을 시작하겠습니다.
