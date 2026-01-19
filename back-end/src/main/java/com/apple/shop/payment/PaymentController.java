package com.apple.shop.payment;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 결제 관련 API 컨트롤러
 * TODO: 실제 Toss Payments API 연동 필요 (Secret Key 필요)
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PaymentController {

    /**
     * 결제 승인 - Toss Payments Success 콜백용
     * FE: /api/confirm 호출 (Success.js)
     * 
     * Plan-31: 서버측 기본 검증 추가 (필수 값 체크)
     * - 실제 Toss API 연동 전까지 임시 검증
     */
    @PostMapping("/confirm")
    public ResponseEntity<Map<String, Object>> confirmPayment(
            @RequestBody PaymentConfirmDTO request) {

        // Plan-31: 서버측 기본 검증 (필수 값 체크)
        if (!isValidPaymentRequest(request)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "success", false,
                            "message", "필수 결제 정보가 누락되었습니다."));
        }

        // TODO: Toss Payments API 연동 (Secret Key 필요)
        // 1. POST https://api.tosspayments.com/v1/payments/confirm
        // 2. 응답 검증 후 주문 상태 업데이트
        // 현재는 기본 검증 후 성공 응답
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

    /**
     * 결제 요청 유효성 검증
     */
    private boolean isValidPaymentRequest(PaymentConfirmDTO request) {
        if (request.getOrderId() == null || request.getOrderId().isBlank()) {
            return false;
        }
        if (request.getPaymentKey() == null || request.getPaymentKey().isBlank()) {
            return false;
        }
        if (request.getAmount() == null || request.getAmount().isBlank()) {
            return false;
        }
        try {
            long amount = Long.parseLong(request.getAmount());
            return amount > 0;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
