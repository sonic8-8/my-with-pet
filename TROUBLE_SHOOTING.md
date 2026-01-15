# 트러블슈팅 기록

> 작업 중 발생한 문제와 해결 방법 기록 (면접 대비)

---

## 인프라 및 배포

### [2026-01-14] Redis/GCP 없이 서버 시작 실패

**문제**
- 로컬 환경에서 Backend 서버 시작 시 Redis/GCP 연결 실패로 Bean 생성 오류 발생
- `org.redisson.api.RedissonClient` Bean 생성 실패
- `com.google.cloud.storage.Storage` Bean 생성 실패

**원인**
- `build.gradle`에 Redis/GCP 의존성이 존재하여 Spring Boot 자동 설정이 Bean 생성 시도
- 로컬 환경에 Redis 서버, GCP 인증 정보 없음

**해결 방법**
- `build.gradle`에서 Redis/GCP 의존성 주석 처리
- `application.yml`에서 prod/local 프로파일 분리
- 관련 서비스 코드 (`StorageService.java`, `DistributedLockAop.java`) 주석 처리

**참고**
- Plan-21: Local 서버 실행을 위한 Redis/GCP 의존성 제거

---

### [2026-01-14] FE-BE 프록시 설정 불일치

**문제**
- Frontend에서 Backend API 호출 시 CORS 오류 또는 404 발생
- `setupProxy.js` 타겟과 `axiosConfig.js` baseURL 불일치

**원인**
- `setupProxy.js`: `http://localhost:8080/api` 타겟
- `axiosConfig.js`: `baseURL: 'http://localhost:8080/api'`
- 프록시와 axios 모두 절대 경로 사용 → 프록시가 제대로 동작하지 않음

**해결 방법**
- `setupProxy.js`: 타겟을 `http://localhost:8080`으로 변경
- `axiosConfig.js`: `baseURL`을 `/api`로 변경 (상대 경로)
- 모든 API 호출이 프록시를 통해 Backend로 전달되도록 통일

**참고**
- Plan-23: Frontend-Backend Proxy 설정 통일

---

## 템플릿

### [날짜] 문제 제목

**문제**
- 발생한 문제 상황 설명

**원인**
- 문제의 근본 원인

**해결 방법**
- 적용한 해결 방법

**참고**
- 관련 Plan 또는 문서 링크
