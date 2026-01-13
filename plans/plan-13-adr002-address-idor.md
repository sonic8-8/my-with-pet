# Plan-13: ADR-002 Address API IDOR 취약점 해결

> **Phase**: 3A (Security - Backend)  
> **생성일**: 2026-01-13  
> **완료일**: 2026-01-13  
> **상태**: ✅ 완료  
> **관련 ADR**: [ADR-002](../adr/ADR-002-address-idor.md)

---

## 목표

ADR-002에서 결정된 **JWT 토큰 기반 사용자 검증**을 `AddressController.java`에 적용하여 IDOR 취약점을 해결합니다.

---

## 현재 상태

```java
// AddressController.java
@GetMapping("/address")
public ResponseEntity<?> getAddress(@RequestParam String memberId) {
    Long memberIdx = findMemberIdxById(memberId);  // 파라미터로 받은 ID 사용 (위험!)
    // ...
}
```

**문제**: 공격자가 임의의 `memberId`를 전달하여 타인의 주소 조회 가능

---

## 구현 체크리스트

### 1. AddressController 수정

- [ ] **1.1** `getAddress` - JWT 토큰에서 사용자 ID 추출
  ```java
  @GetMapping("/address")
  public ResponseEntity<?> getAddress(@RequestHeader("Authorization") String token) {
      String memberId = jwtUtil.getId(token.replace("Bearer ", ""));
      // ...
  }
  ```

- [ ] **1.2** `addAddress` - JWT 토큰 기반 검증

- [ ] **1.3** `updateAllAddresses` - JWT 토큰 기반 검증

- [ ] **1.4** `deleteAddress` - 소유자 검증 추가
  ```java
  @DeleteMapping("/address-delete/{addressIdx}")
  public ResponseEntity<?> deleteAddress(
      @PathVariable Long addressIdx,
      @RequestHeader("Authorization") String token) {
      // 주소 소유자 확인 후 삭제
  }
  ```

### 2. 테스트

- [ ] **2.1** 컴파일 확인
- [ ] **2.2** 타인 주소 접근 시 403 반환 확인

---

## 검증 계획

### 자동 테스트
```bash
cd back-end
.\gradlew compileJava --no-daemon -q
```

### 수동 테스트
1. 로그인 후 본인 주소 조회 → 성공
2. 타인 memberId로 주소 조회 시도 → JWT에서 추출한 ID와 불일치 → 차단

---

## 완료 기준

1. ✅ AddressController 4개 API JWT 토큰 검증 적용
2. ✅ Backend 컴파일 성공
3. ✅ IDOR 공격 차단 확인
