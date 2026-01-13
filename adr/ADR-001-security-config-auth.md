# ADR-001: SecurityConfig 인증 정책 수립

> **상태**: 🟡 승인 대기  
> **생성일**: 2026-01-13  
> **결정자**: [사용자 승인 필요]

---

## 컨텍스트

현재 `SecurityConfig.java`의 `configureAuthorization` 메서드에서 모든 요청에 대해 `permitAll()`을 적용하고 있습니다.

```java
http.authorizeHttpRequests(auth -> auth
        .requestMatchers("/**", "/api/**").permitAll()
        .anyRequest().authenticated());
```

### 문제점
- **모든 API 엔드포인트가 인증 없이 접근 가능**
- JWT 필터는 존재하지만 인증 실패 시에도 요청이 통과됨
- 사용자 정보 조회, 주문 처리 등 민감한 API도 무인가 접근 가능

### 심각도
🔴 **CRITICAL** - 즉시 대응 필요

---

## 결정 옵션

### 옵션 A: 역할 기반 접근 제어 (RBAC) 도입 ⭐ 권장

```java
http.authorizeHttpRequests(auth -> auth
    // 공개 API
    .requestMatchers("/api/login", "/api/register", "/api/store-list/**", "/api/shop/**").permitAll()
    // 고객 전용 API
    .requestMatchers("/api/address/**", "/api/order/**", "/api/cart/**").hasRole("USER")
    // 사업자 전용 API
    .requestMatchers("/api/business/**").hasRole("BUSINESS")
    // 그 외 모든 요청은 인증 필요
    .anyRequest().authenticated()
);
```

**장점**:
- 역할별 명확한 권한 분리
- 확장성 높음 (새 역할 추가 용이)

**단점**:
- 구현 복잡도 증가
- 기존 Frontend 호출에 영향 줄 수 있음

---

### 옵션 B: 최소한의 인증 적용

```java
http.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/login", "/api/register").permitAll()
    .anyRequest().authenticated()
);
```

**장점**:
- 구현 간단
- 즉시 적용 가능

**단점**:
- 세분화된 권한 제어 어려움
- 비회원 접근 가능한 API (상품 조회 등) 도 인증 필요

---

## 권장 결정

**옵션 A: 역할 기반 접근 제어 (RBAC) 도입**

### 구현 계획

1. **공개 API 식별** (인증 불필요)
   - `/api/login`, `/api/register`
   - `/api/store-list/**`, `/api/shop/**` (상품 조회)
   - `/api/store-info` (매장 정보 조회)

2. **고객 전용 API 식별**
   - `/api/address/**`, `/api/order/**`, `/api/cart/**`
   - `/api/review/**` (리뷰 작성)

3. **사업자 전용 API 식별**
   - `/api/business/**`

4. **Frontend 영향도 분석** 및 테스트

### 예상 영향

| 영역 | 영향 |
|------|------|
| Frontend | JWT 토큰 필수 전송 확인 필요 |
| 기존 사용자 | 로그인 필수 (일부 기능) |
| API 테스트 | 인증 토큰 추가 필요 |

---

## 승인 요청

> [!CAUTION]
> 이 변경은 기존 API 호출에 영향을 줄 수 있습니다.
> Frontend에서 JWT 토큰이 올바르게 전송되고 있는지 확인이 필요합니다.

**승인 시 구현을 진행하겠습니다.**
