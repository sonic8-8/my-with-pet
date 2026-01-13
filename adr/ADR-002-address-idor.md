# ADR-002: Address API IDOR 취약점 해결

> **상태**: ✅ 완료  
> **생성일**: 2026-01-13  
> **결정자**: 사용자 승인 (2026-01-13)

---

## 컨텍스트

현재 `AddressController`에서 사용자 식별을 **쿼리 파라미터**로 받고 있습니다.

```java
@GetMapping("/address")
public ResponseEntity<?> getAddress(@RequestParam String memberId) {
    Long memberIdx = findMemberIdxById(memberId);
    List<Address> addressList = addressRepository.findByMemberIdx(memberIdx);
    return ResponseEntity.ok(addressList);
}
```

### 문제점 (IDOR - Insecure Direct Object Reference)
- **공격자가 임의의 `memberId`를 전달하여 타인의 주소 조회 가능**
- `addAddress`, `updateAllAddresses`, `deleteAddress`도 동일한 취약점 존재
- JWT 토큰 검증 없이 요청 파라미터만으로 사용자 식별

### 심각도
🔴 **CRITICAL** - 개인정보 유출 위험

---

## 결정 옵션

### 옵션 A: JWT 토큰 기반 사용자 검증 ⭐ 권장

```java
@GetMapping("/address")
public ResponseEntity<?> getAddress(@RequestHeader("Authorization") String token) {
    String memberId = jwtUtil.getId(token.replace("Bearer ", ""));
    Long memberIdx = findMemberIdxById(memberId);
    List<Address> addressList = addressRepository.findByMemberIdx(memberIdx);
    return ResponseEntity.ok(addressList);
}
```

**장점**:
- JWT 토큰에서 사용자 ID 추출 → 위변조 불가
- 타인의 정보 접근 원천 차단

**단점**:
- Frontend에서 Authorization 헤더 전송 필수

---

### 옵션 B: Spring Security Context 활용

```java
@GetMapping("/address")
public ResponseEntity<?> getAddress() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String memberId = auth.getName();
    // ...
}
```

**장점**:
- Spring Security 표준 방식
- 코드 간결

**단점**:
- ADR-001 (SecurityConfig 인증 정책) 선행 필요

---

## 권장 결정

**옵션 A: JWT 토큰 기반 사용자 검증**

ADR-001과 연계하여 ADR-001 승인 후 옵션 B로 전환 가능.

### 수정 대상 API

| API | 현재 | 변경 |
|-----|------|------|
| `GET /api/address` | `@RequestParam memberId` | JWT 토큰 추출 |
| `POST /api/address-add` | `@RequestBody AddressDTO.memberId` | JWT 토큰 추출 |
| `POST /api/address-update` | `@RequestBody userId` | JWT 토큰 추출 |
| `DELETE /api/address-delete/{idx}` | 인증 없음 | 소유자 검증 추가 |

---

## 승인 요청

> [!WARNING]
> 이 변경은 Frontend에서 모든 Address API 호출 시 Authorization 헤더 전송이 필요합니다.

**승인 시 구현을 진행하겠습니다.**
