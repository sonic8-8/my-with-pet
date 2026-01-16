package com.apple.shop.payment;

import lombok.Getter;
import lombok.Setter;

/**
 * 결제 확인 요청 DTO
 */
@Getter
@Setter
public class PaymentConfirmDTO {
    private String orderId;
    private String amount;
    private String paymentKey;
}
