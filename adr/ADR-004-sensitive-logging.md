# ADR-004: 민감 정보 로깅 제거

> **상태**: ✅ 완료  
> **생성일**: 2026-01-13  
> **결정자**: 사용자 승인 (2026-01-14)

---

## 컨텍스트

Phase 1에서 대부분의 `System.out.println` 디버그 로깅을 제거했으나, 일부 민감 정보 로깅이 남아있을 수 있습니다.

### 문제점
- JWT 토큰, 비밀번호 등이 콘솔에 출력될 경우 보안 위험
- 프로덕션 환경에서 로그 파일에 민감 정보 노출 가능

### 심각도
🟡 **HIGH**

---

## 권장 결정

### 조치 사항

1. **남은 System.out.println 검색 및 제거**
   ```bash
   grep -r "System.out.println" back-end/src/
   ```

2. **SLF4J Logger 도입**
   - `System.out.println` → `log.debug()`, `log.info()` 등
   - 프로덕션에서는 DEBUG 레벨 비활성화

3. **민감 정보 마스킹**
   - 비밀번호: `****` 처리
   - JWT 토큰: 앞 10자만 표시

---

## 구현 계획

1. 남은 디버그 로깅 검색
2. SLF4J Logger 적용 (Lombok `@Slf4j` 사용)
3. 로그 레벨 설정 (`application.properties`)

---

## 승인 요청

**승인 시 구현을 진행하겠습니다.**
