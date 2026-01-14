# Plan-20: Backend H2 데이터베이스 파일 모드 변경

> **Phase**: 인프라 수정  
> **생성일**: 2026-01-14  
> **완료일**: 2026-01-14  
> **상태**: ✅ 완료

---

## 목표

로컬에서 H2를 별도 설치/서버 구동 없이 실행하도록 `application.yml`을 파일 모드로 변경합니다.

---

## 문제 분석 (사용자 제공)

**현재 오류**: `jdbc:h2:tcp://localhost/~/withpet` 접속 시 H2 서버가 없어 JDBC 메타데이터 읽기 실패

**원인**: TCP 모드는 별도 H2 서버 구동 필요

**해결책**: `jdbc:h2:file:./data/withpet`으로 변경 (파일 모드)

---

## 구현 체크리스트

### 1. application.yml 수정

- [ ] **1.1** `spring.datasource.url` 변경
  - 변경 전: `jdbc:h2:tcp://localhost/~/withpet`
  - 변경 후: `jdbc:h2:file:./data/withpet`

### 2. 검증

- [ ] **2.1** Backend 서버 실행 (`.\gradlew bootRun`)
- [ ] **2.2** 로그에서 오류 없음 확인
- [ ] **2.3** `back-end/data/withpet.mv.db` 파일 생성 확인

---

## 기대 결과

1. ✅ 실행 시 `back-end/data/withpet.mv.db` 자동 생성
2. ✅ 재실행 시 테스트 데이터 유지
3. ✅ Dialect 판단 오류 해결

---

## 완료 기준

1. ✅ Backend 서버 정상 실행
2. ✅ H2 파일 생성 확인
