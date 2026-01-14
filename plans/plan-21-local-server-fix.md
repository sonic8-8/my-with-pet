# Plan-21: Local 서버 실행을 위한 Redis/GCP 의존성 제거

> **Phase**: 인프라 수정  
> **생성일**: 2026-01-14  
> **상태**: 🟡 승인 대기

---

## 목표

Local 개발 환경에서 Redis와 GCP 없이 서버를 정상 실행할 수 있도록 설정을 수정합니다.

---

## 현재 문제

| 문제 | 원인 |
|------|------|
| 서버 시작 실패 | Redis 연결 시도 (localhost:6379 없음) |
| Bean 생성 오류 | GCP Storage 설정 필요 |
| JWT secret 누락 | local profile에 jwt.secret 없음 |

---

## 구현 체크리스트

### 1. application.yml local profile 수정

- [ ] **1.1** Redis 설정 제거 또는 비활성화
- [ ] **1.2** GCP Storage 설정 제거 또는 비활성화
- [ ] **1.3** JWT secret 추가 (개발용)

### 2. 코드 수정 (필요시)

- [ ] **2.1** Redis 의존성 @ConditionalOnProperty 추가 검토
- [ ] **2.2** GCP Storage 의존성 @ConditionalOnProperty 추가 검토

### 3. 이전 Plan-20 변경사항 원복

- [ ] **3.1** 승인 없이 추가된 JWT secret 제거 후 이 Plan에서 재추가

---

## 변경 내용 요약

**application.yml (local profile)**:
```yaml
# 변경 전
spring:
  data:
    redis:
      host: localhost
  cloud:
    gcp:
      storage:
        bucket: ...

# 변경 후
# Redis, GCP 설정 제거
jwt:
  secret: local-dev-secret-key
```

---

## 검증 계획

```bash
cd back-end
.\gradlew bootRun --no-daemon
```

- 서버 정상 시작 확인 (Started ... in X seconds)
- 오류 없음 확인

---

## 완료 기준

1. ✅ Backend 서버 정상 시작
2. ✅ Redis/GCP 없이 로컬 실행 가능
