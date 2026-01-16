# Plan-25: 주문/장바구니 IDOR 취약점 수정 (Phase 6A.5)

> **상태**: ✅ 완료  
> **생성일**: 2026-01-16  
> **관련**: ROADMAP.md Phase 6A.5, REVIEW.md

---

## 목표

IDOR(Insecure Direct Object Reference) 취약점을 수정하여 사용자가 자신의 데이터에만 접근할 수 있도록 합니다.

| 엔드포인트 | 현재 문제 | 수정 방향 |
|-----------|----------|----------|
| `POST /api/orders/orderhistory` | `userId`를 body에서 받음 | JWT 토큰에서 추출 |
| `POST /api/cart/add` | `memberId`를 body에서 받음 | JWT 토큰에서 추출 |

---

## 현재 문제 분석

### 1. OrdersController - 주문 이력 조회

```java
// OrdersController.java (Line 27-35)
@PostMapping("/orders/orderhistory")
public List<Orders> loadOrderHistory(@RequestBody Map<String, String> data) {
    String userId = data.get("userId");  // ❌ 클라이언트가 임의의 userId 전송 가능
    Long userIdx = memberRepository.findById(userId).get().getIdx();
    List<Orders> orders = ordersRepository.findByMemberIdx(userIdx);
    return orders;
}
```

**취약점**: 공격자가 다른 사용자의 `userId`를 전송하면 해당 사용자의 주문 내역 조회 가능

### 2. CartController - 장바구니 추가

```java
// CartController.java (Line 18-22)
@PostMapping("/cart/add")
public void addCart(@RequestBody Cart cart) {
    // cart.memberId가 클라이언트에서 전송됨 ❌
    cartRepository.save(cart);
}
```

**취약점**: 공격자가 `cart.memberId`에 다른 사용자 ID를 넣으면 다른 사용자 장바구니에 아이템 추가 가능

---

## 수정 계획

### 방법 1: @AuthenticationPrincipal 사용 (권장)

Spring Security의 `@AuthenticationPrincipal`을 사용하여 현재 인증된 사용자 정보를 직접 주입받습니다.

#### [MODIFY] OrdersController.java

```java
@PostMapping("/orders/orderhistory")
public ResponseEntity<List<Orders>> loadOrderHistory(
        @AuthenticationPrincipal CustomUserDetails userDetails) {
    if (userDetails == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    
    String userId = userDetails.getUsername();
    Member member = memberRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    
    List<Orders> orders = ordersRepository.findByMemberIdx(member.getIdx());
    return ResponseEntity.ok(orders);
}
```

#### [MODIFY] CartController.java

```java
@PostMapping("/cart/add")
public ResponseEntity<String> addCart(
        @RequestBody CartDTO cartDTO,
        @AuthenticationPrincipal CustomUserDetails userDetails) {
    if (userDetails == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    
    Cart cart = new Cart();
    cart.setItemIdx(cartDTO.getItemIdx());
    cart.setType(cartDTO.getType());
    cart.setName(cartDTO.getName());
    cart.setPrice(cartDTO.getPrice());
    cart.setQuantity(cartDTO.getQuantity());
    cart.setImg(cartDTO.getImg());
    cart.setStoreIdx(cartDTO.getStoreIdx());
    cart.setMemberId(userDetails.getUsername());  // ✅ JWT에서 추출한 사용자 ID
    
    cartRepository.save(cart);
    return ResponseEntity.ok("장바구니에 추가되었습니다.");
}
```

#### [NEW] CartDTO.java

`memberId`를 제외한 DTO를 생성하여 클라이언트가 memberId를 조작하지 못하도록 합니다.

```java
@Getter
@Setter
public class CartDTO {
    private Long itemIdx;
    private String type;
    private String name;
    private Integer price;
    private Integer quantity;
    private String img;
    private Long storeIdx;
    // memberId 없음 - 서버에서 JWT로 설정
}
```

---

## 추가 개선

### HTTP 메서드 변경 (GET 권장)

주문 이력 조회는 데이터를 변경하지 않으므로 GET 메서드가 더 적합합니다.

```java
@GetMapping("/orders/history")
public ResponseEntity<List<Orders>> loadOrderHistory(
        @AuthenticationPrincipal CustomUserDetails userDetails) {
    // ...
}
```

---

## 검증 계획

### Gradle 빌드 테스트

```bash
cd back-end && ./gradlew build -x test
```

### 수동 검증 (Postman/curl 사용)

1. **정상 케이스: 자신의 주문 조회**
   ```bash
   # 로그인하여 토큰 획득
   curl -X POST http://localhost:8080/api/login \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "id=testuser&pw=password"
   
   # 주문 이력 조회 (Authorization 헤더에 토큰 포함)
   curl -X GET http://localhost:8080/api/orders/history \
     -H "Authorization: Bearer <JWT_TOKEN>"
   ```
   - 예상 결과: 200 OK, 자신의 주문 내역만 반환

2. **IDOR 방어 검증**
   - 기존 API에서는 body에 다른 userId를 넣으면 다른 사용자 데이터 조회 가능
   - 수정 후: body의 userId 무시, JWT 토큰의 사용자만 조회

3. **장바구니 추가 테스트**
   ```bash
   curl -X POST http://localhost:8080/api/cart/add \
     -H "Authorization: Bearer <JWT_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"itemIdx": 1, "type": "food", "name": "상품", "price": 10000, "quantity": 1, "img": "...", "storeIdx": 1}'
   ```
   - 예상 결과: 200 OK, DB에 저장된 memberId가 JWT 토큰의 사용자 ID와 일치

---

## 영향 범위

| 파일 | 변경 내용 |
|------|----------|
| `OrdersController.java` | `@AuthenticationPrincipal` 추가, POST→GET 변경 |
| `CartController.java` | `@AuthenticationPrincipal` 추가, CartDTO 사용 |
| `CartDTO.java` | **[NEW]** memberId 없는 DTO 생성 |

### Frontend 수정 필요

| 파일 | 변경 내용 |
|------|----------|
| `OrderList.js` | `POST /orders/orderhistory` → `GET /orders/history`, body 제거 |
| `Cart.js` | `memberId` 필드 제거 |

---

## 의존성

- Plan-24 완료 필요 (JWT 토큰 정상 발급/검증)

## 예상 소요 시간

- Backend 구현: 30분
- Frontend 수정: 20분
- 테스트: 20분
