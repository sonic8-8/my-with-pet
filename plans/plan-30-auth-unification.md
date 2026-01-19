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
- [x] `StoreMemberUserDetails.java` 생성
- [x] `StoreMemberUserDetailsService.java` 생성
- [x] `StoreMemberLoginFilter.java` 생성
- [x] `SecurityConfig.java` 수정 (필터 등록, AuthenticationManager 분리)
- [x] `MemberController.login()` 삭제
- [x] `StoreMemberController.login()` 삭제
- [x] `CustomUserDetailsService.java` 예외 처리 개선 (.get() → orElseThrow)
- [x] Gradle 빌드 테스트

### Frontend
- [x] `Login.js` 수정 (Header에서 토큰 추출, form-urlencoded 전송)
- [x] `BizLogin.js` 수정 (Header에서 토큰 추출, form-urlencoded 전송)
- [x] `Redux/store.js` extraReducers 중복 제거, await 추가

---

## 검증 방법

1. Backend 빌드 성공 ✅
2. 일반 사용자 로그인 → JWT 쿠키 저장 → 보호 API 접근
3. 사업자 로그인 → JWT 쿠키 저장 → `/api/business/**` 접근

---

## 수정된 파일 목록

### Backend (신규)
- `storeMember/StoreMemberUserDetails.java`
- `storeMember/StoreMemberUserDetailsService.java`
- `storeMember/StoreMemberLoginFilter.java`

### Backend (수정)
- `SecurityConfig.java` - 두 개의 AuthenticationManager 설정, 필터 등록
- `MemberController.java` - login() 메서드 삭제
- `StoreMemberController.java` - login() 메서드 삭제
- `CustomUserDetailsService.java` - .get() → orElseThrow() 변경

### Frontend (수정)
- `Login.js` - form-urlencoded 전송, Header에서 토큰 추출
- `BizLogin.js` - 동일하게 LoginFilter 방식으로 변경
- `Redux/store.js` - extraReducers 중복 제거, await 추가, Authorization 헤더 사용
