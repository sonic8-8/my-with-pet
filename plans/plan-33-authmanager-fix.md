# Plan-33: AuthenticationManager 빈 충돌 수정

> **상태**: ✅ 완료 (2026-01-19)  
> **목표**: Spring Security AuthenticationManager 빈 2개 충돌 해결  
> **원인**: Plan-32에서 StoreMemberLoginFilter 추가 시 발생

---

## 문제 상황

서버 실행 시 다음 오류 발생:
```
Found 2 beans for type interface AuthenticationManager, but none marked as primary
```

---

## 원인 분석

`SecurityConfig.java`에서 2개의 `AuthenticationManager` 빈을 정의:
- `memberAuthenticationManager()`: 일반 사용자용
- `storeMemberAuthenticationManager()`: 사업자용

Spring Security가 기본 `AuthenticationManager`를 결정할 수 없어 충돌 발생.

---

## 해결 방안

`memberAuthenticationManager()`에 `@Primary` 어노테이션 추가하여 기본 빈으로 지정.

---

## 체크리스트

- [x] `SecurityConfig.java`에 `@Primary` import 추가
- [x] `memberAuthenticationManager()`에 `@Primary` 어노테이션 추가
- [x] Backend 빌드 테스트 (exit 0)

---

## 수정 파일

| 파일 | 변경 내용 |
|------|----------|
| `SecurityConfig.java` | `import org.springframework.context.annotation.Primary` 추가, `@Primary` 어노테이션 추가 |
