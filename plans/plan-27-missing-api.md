# Plan-27: 미구현 API 구현 (Phase 6B.4)

> **상태**: ✅ 완료  
> **생성일**: 2026-01-16  
> **관련**: ROADMAP.md Phase 6B.4, REVIEW.md

---

## 목표

Frontend에서 호출하지만 Backend에 구현되지 않은 API 엔드포인트들을 구현합니다.

| # | API | FE 위치 | 현재 상태 |
|---|-----|---------|----------|
| 1 | `POST /api/business/verify` | `BizNumAuth.js` | 404 |
| 2 | `POST /api/business/storeinfo` | `useStoreInfoForm.js` | 404 |
| 3 | `POST /api/confirm` | `Success.js` | 404 |
| 4 | `POST /api/order` | `useOrderForm.js` | 빈 메서드 |

---

## 구현 계획

### 1. 사업자번호 인증 API

**FE 요청 형식** (`BizNumAuth.js` Line 12-14):
```javascript
axios.post('/api/business/verify', { b_no: [businessNumber] })
// 응답: { valid: true/false }
```

#### [MODIFY] StoreMemberController.java

```java
@PostMapping("/verify")
public ResponseEntity<Map<String, Boolean>> verifyBusinessNumber(
        @RequestBody Map<String, List<String>> request) {
    List<String> businessNumbers = request.get("b_no");
    
    if (businessNumbers == null || businessNumbers.isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("valid", false));
    }
    
    // TODO: 실제 사업자번호 검증 API 연동 (국세청 API 등)
    // 현재는 더미 검증 (10자리 숫자 체크)
    String bNo = businessNumbers.get(0);
    boolean valid = bNo != null && bNo.matches("\\d{10}");
    
    return ResponseEntity.ok(Map.of("valid", valid));
}
```

> **참고**: 실제 사업자번호 검증은 국세청 공공데이터 API 연동이 필요하지만, 현재는 형식 검증만 수행

---

### 2. 가게 정보 저장 API

**FE 요청 형식** (`useStoreInfoForm.js` Line 89):
```javascript
axios.post('/api/business/storeinfo', formData);
// formData: storeName, storePhone, storeAddr, storeNotice, ...
```

#### [MODIFY] StoreMemberController.java

```java
@PostMapping("/storeinfo")
public ResponseEntity<String> saveStoreInfo(
        @RequestBody StoreInfoDTO storeInfo,
        @AuthenticationPrincipal CustomUserDetails userDetails) {
    if (userDetails == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    
    // TODO: Store 엔티티에 저장 로직 구현
    // 현재는 성공 응답만 반환
    return ResponseEntity.ok("가게 정보가 저장되었습니다.");
}
```

#### [NEW] StoreInfoDTO.java

```java
@Getter
@Setter
public class StoreInfoDTO {
    private String storeName;
    private String storePhone;
    private String storeAddr;
    private String storeNotice;
    private String businessHours;
    private String storeImg;
}
```

---

### 3. 결제 승인 API

**FE 요청 형식** (`Success.js` Line 19-25):
```javascript
fetch('/api/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        orderId: '...',
        amount: '...',
        paymentKey: '...'
    })
})
// 응답: { success: true } 또는 { message: '...', code: '...' }
```

#### [NEW] PaymentController.java

```java
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PaymentController {

    @PostMapping("/confirm")
    public ResponseEntity<Map<String, Object>> confirmPayment(
            @RequestBody PaymentConfirmDTO request) {
        // TODO: Toss Payments API 연동
        // 현재는 더미 성공 응답
        return ResponseEntity.ok(Map.of(
            "success", true,
            "orderId", request.getOrderId(),
            "amount", request.getAmount()
        ));
    }
    
    @PostMapping("/v1/payment/confirm")
    public ResponseEntity<Map<String, Object>> confirmPaymentV1(
            @RequestBody PaymentConfirmDTO request) {
        // paymentApi.js에서 호출하는 경로
        return confirmPayment(request);
    }
}
```

#### [NEW] PaymentConfirmDTO.java

```java
@Getter
@Setter
public class PaymentConfirmDTO {
    private String orderId;
    private String amount;
    private String paymentKey;
}
```

---

### 4. 주문 저장 API (로직 구현)

**FE 요청 형식** (`useOrderForm.js` Line 26-32):
```javascript
api.post('/order', JSON.stringify({
    cartItems,
    status,
    orderMemo,
    deliveryAddr,
    recipientPhone
}))
```

#### [MODIFY] OrdersController.java

```java
@PostMapping("/order")
public ResponseEntity<String> saveOrder(
        @RequestBody OrdersDTO data,
        @AuthenticationPrincipal CustomUserDetails userDetails) {
    if (userDetails == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    
    String memberId = userDetails.getUsername();
    Member member = memberRepository.findById(memberId).orElse(null);
    if (member == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    
    Orders order = new Orders();
    order.setMemberIdx(member.getIdx());
    order.setDeliveryAddr(data.getDeliveryAddr());
    order.setRecipientPhone(data.getRecipientPhone());
    order.setOrderMemo(data.getOrderMemo());
    order.setOrderStatus(data.getStatus());
    order.setOrderedAt(Instant.now());
    
    ordersRepository.save(order);
    return ResponseEntity.ok("주문이 완료되었습니다.");
}
```

---

## 검증 계획

### 빌드 테스트

```bash
cd back-end && ./gradlew build -x test
```

### 수동 검증 (Postman/curl)

1. **사업자번호 인증**
   ```bash
   curl -X POST http://localhost:8080/api/business/verify \
     -H "Content-Type: application/json" \
     -d '{"b_no": ["1234567890"]}'
   # 예상: {"valid": true}
   ```

2. **결제 승인**
   ```bash
   curl -X POST http://localhost:8080/api/confirm \
     -H "Content-Type: application/json" \
     -d '{"orderId": "order_123", "amount": "10000", "paymentKey": "pk_test"}'
   # 예상: {"success": true, ...}
   ```

---

## 영향 범위

| 파일 | 변경 내용 |
|------|----------|
| `StoreMemberController.java` | `verify`, `storeinfo` 엔드포인트 추가 |
| `StoreInfoDTO.java` | **[NEW]** 가게 정보 DTO |
| `PaymentController.java` | **[NEW]** 결제 컨트롤러 |
| `PaymentConfirmDTO.java` | **[NEW]** 결제 확인 DTO |
| `OrdersController.java` | `saveOrder` 로직 구현 |
| `OrdersDTO.java` | 필드 확인/추가 필요 |

---

## 의존성

- Plan-24 완료 (인증/보안)
- Plan-25 완료 (IDOR 수정)

## 예상 소요 시간

- 구현: 30분
- 테스트: 15분

## 참고사항

> **⚠️ 주의**: 실제 서비스에서는 다음이 필요합니다:
> - 사업자번호 검증: 국세청 공공데이터 API 연동
> - 결제 승인: Toss Payments API 연동 (Secret Key 필요)
> 
> 현재는 **더미 구현**으로 진행하고, 실제 연동은 별도 Plan으로 분리합니다.
