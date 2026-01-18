# Plan-30: 로그인 흐름 통일 및 사업자 JWT 발급

> **상태**: ✅ 완료  
> **작성일**: 2026-01-18  
> **완료일**: 2026-01-19  
> **연관 ROADMAP**: Phase 6 보완 (REVIEW_2.md 이슈 해결)

---

## 목표

1. **사업자 로그인 JWT 발급**: `StoreMemberLoginFilter` 추가
2. **로그인 경로 통일**: Controller 방식 → LoginFilter 방식으로 통일
3. **프론트엔드 수정**: LoginFilter 응답 형식에 맞게 수정

---

## 현재 상태 분석

### Backend

| 구분 | 현재 구현 | 문제점 |
|------|----------|-------|
| 일반 사용자 | `MemberController.login()` - JWT 발급 O | Controller 방식 (비표준) |
| 일반 사용자 | `LoginFilter` - JWT 발급 O | 미사용 중 (FE가 Controller 호출) |
| 사업자 | `StoreMemberController.login()` | JWT 발급 X, 문자열만 반환 |

### Frontend

| 구분 | API 호출 | 응답 처리 |
|------|---------|----------|
| Login.js | `POST /api/login` | `response.data.token` 추출 |
| BizLogin.js | `POST /api/business/login` | `response.data.token` 추출 (현재 undefined) |

---

## 구현 계획

### 1. Backend 변경

#### 1.1 [NEW] `StoreMemberUserDetailsService.java`
사업자 테이블에서 인증 정보를 조회하는 서비스

```java
@Service
@RequiredArgsConstructor
public class StoreMemberUserDetailsService implements UserDetailsService {
    private final StoreMemberRepository storeMemberRepository;
    
    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        StoreMember member = storeMemberRepository.findById(id)
            .orElseThrow(() -> new UsernameNotFoundException("사업자를 찾을 수 없습니다."));
        return new StoreMemberUserDetails(member);
    }
}
```

#### 1.2 [NEW] `StoreMemberUserDetails.java`
사업자 인증 정보 래퍼

#### 1.3 [NEW] `StoreMemberLoginFilter.java`
`/api/business/login` 경로에서 동작하는 사업자 전용 로그인 필터

```java
public class StoreMemberLoginFilter extends UsernamePasswordAuthenticationFilter {
    // 경로: /api/business/login
    // 인증 성공 시 JWT 발급 (ROLE_BUSINESS)
}
```

#### 1.4 [MODIFY] `SecurityConfig.java`
- `StoreMemberLoginFilter` 등록
- 두 AuthenticationManager 분리 (Member용, StoreMember용)

#### 1.5 [DELETE] `MemberController.login()`
- LoginFilter 방식으로 통일하므로 Controller 메서드 삭제

### 2. Frontend 변경

#### 2.1 [MODIFY] `Login.js`
LoginFilter는 **Response Header**에 JWT를 반환하므로 수정 필요:

```javascript
// 현재: response.data.token (Controller 방식)
// 변경: response.headers['authorization'] (LoginFilter 방식)
axios.post('/login', { id, pw }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
```

> **주의**: LoginFilter는 form-urlencoded 형식으로 `id`, `pw` 파라미터를 받음

#### 2.2 [MODIFY] `BizLogin.js`
동일하게 Header에서 JWT 추출하도록 수정

---

## 체크리스트

### Backend
- [ ] `StoreMemberUserDetails.java` 생성
- [ ] `StoreMemberUserDetailsService.java` 생성
- [ ] `StoreMemberLoginFilter.java` 생성
- [ ] `SecurityConfig.java` 수정 (필터 등록, AuthenticationManager 분리)
- [ ] `MemberController.login()` 삭제
- [ ] `CustomUserDetailsService.java` 예외 처리 개선 (.get() → orElseThrow)
- [ ] Gradle 빌드 테스트

### Frontend
- [ ] `Login.js` 수정 (Header에서 토큰 추출)
- [ ] `BizLogin.js` 수정 (Header에서 토큰 추출)
- [ ] 로그인 테스트

---

## 검증 방법

1. Backend 빌드 성공
2. 일반 사용자 로그인 → JWT 쿠키 저장 → 보호 API 접근
3. 사업자 로그인 → JWT 쿠키 저장 → `/api/business/**` 접근

---

## GCP MySQL 구성 권장 (질문 3 답변)

### 부하 테스트용 DB 구성

| 단계 | 환경 | DB 구성 | 비용 |
|------|------|---------|------|
| **개발** | Docker Compose | MySQL 컨테이너 | 무료 |
| **테스트 배포** | GCP | Cloud SQL db-g1-small | ~$25/월 |
| **부하 테스트** | GCP | Cloud SQL db-custom-2-7680 (2 vCPU) | ~$100/월 |
| **데모 유지** | GCP | 필요 시만 Cloud SQL 켜기 | 가변 |

### 권장 전략

```
[개발/로컬]
  Docker Compose
  ├── backend:8080
  ├── frontend:80 (Nginx)
  └── mysql:3306 (컨테이너)

[부하 테스트용 GCP 배포]
  Cloud Run (Backend) ──────┐
  Cloud Run (Frontend) ─────┼──▶ Cloud SQL (MySQL)
                            │     - db-g1-small (테스트)
                            │     - db-custom-2-7680 (부하 테스트)
```

### 부하 테스트 시 DB 권장 사양

| 테스트 유형 | 예상 RPS | Cloud SQL 권장 |
|------------|---------|---------------|
| 가벼운 테스트 | 10-50 RPS | db-g1-small (1.7GB) |
| 중간 부하 | 50-200 RPS | db-custom-2-7680 (2 vCPU, 7.5GB) |
| 높은 부하 | 200+ RPS | db-custom-4-15360 (4 vCPU, 15GB) |

> **팁**: 부하 테스트 시에만 스펙 업그레이드 후 테스트 완료하면 다운그레이드

---

## 예상 영향

- **신규 파일**: 3개 (StoreMember 인증 관련)
- **수정 파일**: 4개 (SecurityConfig, Login.js, BizLogin.js, CustomUserDetailsService)
- **삭제**: MemberController.login() 메서드
