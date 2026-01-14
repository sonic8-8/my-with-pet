# Plan-21: Local 서버 실행을 위한 Redis/GCP 의존성 제거

> **Phase**: 인프라 수정  
> **생성일**: 2026-01-14  
> **완료일**: 2026-01-14  
> **상태**: ✅ 완료

---

## 목표

Local 개발 환경에서 Redis와 GCP 없이 서버를 정상 실행할 수 있도록 설정을 수정합니다.

---

## 현재 문제

| 문제 | 원인 |
|------|------|
| 서버 시작 실패 | `build.gradle`에 Redis/GCP 의존성 존재 |
| Bean 생성 오류 | 자동 설정으로 Redis/GCP 빈 생성 시도 |

---

## 구현 체크리스트

### 1. build.gradle 수정

- [x] **1.1** Redis 의존성 주석 처리 완료 (Line 44)
  ```gradle
  // implementation 'org.redisson:redisson-spring-boot-starter:3.31.0'
  ```

- [x] **1.2** GCP 의존성 주석 처리 완료
  ```gradle
  // implementation 'com.google.cloud:spring-cloud-gcp-starter-storage'
  ```

### 2. application.yml 수정 (이미 완료)

- [x] **2.1** Redis 설정 제거
- [x] **2.2** GCP Storage 설정 제거
- [x] **2.3** JWT secret 추가

---

## 검증 계획

```bash
cd back-end
.\gradlew bootRun --no-daemon
```

- 서버 정상 시작 확인

---

## 완료 기준

1. ✅ Backend 서버 정상 시작
2. ✅ Redis/GCP 없이 로컬 실행 가능

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
