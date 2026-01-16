package com.apple.shop.payment;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 결제 관련 API 컨트롤러
 * TODO: 실제 Toss Payments API 연동 필요
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PaymentController {

    /**
     * 결제 승인 - Toss Payments Success 콜백용
     * FE: /api/confirm 호출 (Success.js)
     */
    @PostMapping("/confirm")
    public ResponseEntity<Map<String, Object>> confirmPayment(
            @RequestBody PaymentConfirmDTO request) {
        // TODO: Toss Payments API 연동 (Secret Key 필요)
        // 현재는 더미 성공 응답
        return ResponseEntity.ok(Map.of(
                "success", true,
                "orderId", request.getOrderId(),
                "amount", request.getAmount()));
    }

    /**
     * 결제 승인 V1 - paymentApi.js용
     */
    @PostMapping("/v1/payment/confirm")
    public ResponseEntity<Map<String, Object>> confirmPaymentV1(
            @RequestBody PaymentConfirmDTO request) {
        return confirmPayment(request);
    }
}
