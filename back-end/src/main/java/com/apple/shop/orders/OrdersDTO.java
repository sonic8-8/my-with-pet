package com.apple.shop.orders;

import com.apple.shop.cart.Cart;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrdersDTO {
    private List<Cart> cartItems;
    private String status;
    private String orderMemo;
    private String deliveryAddr;
    private String recipientPhone;
    private String recipientName;
    private String payMethod;
    private Integer payAmount;
    private Long storeIdx;
}
