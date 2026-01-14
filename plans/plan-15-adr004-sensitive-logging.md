# Plan-15: ADR-004 민감 정보 로깅 제거

> **Phase**: 3A (Security - Backend)  
> **생성일**: 2026-01-14  
> **완료일**: 2026-01-14  
> **상태**: ✅ 완료  
> **관련 ADR**: [ADR-004](../adr/ADR-004-sensitive-logging.md)

---

## 목표

남은 `System.out.println` 디버그 로깅을 제거하여 민감 정보 노출을 방지합니다.

---

## 현재 상태

검색 결과 남은 `System.out.println` 2개:

| 파일 | 라인 | 내용 |
|------|------|------|
| `OrdersController.java` | 30 | `System.out.println(userId);` |
| `ReviewController.java` | 24 | `System.out.println(reviewList);` |

---

## 구현 체크리스트

### 1. 디버그 로깅 제거

- [ ] **1.1** `OrdersController.java` - Line 30 제거
- [ ] **1.2** `ReviewController.java` - Line 24 제거

---

## 검증 계획

### 자동 테스트
```bash
cd back-end
.\gradlew compileJava --no-daemon -q
Get-ChildItem -Recurse -Filter "*.java" -Path "src" | Select-String -Pattern "System\.out\.println"
```

---

## 완료 기준

1. ✅ 모든 System.out.println 제거
2. ✅ Backend 컴파일 성공
