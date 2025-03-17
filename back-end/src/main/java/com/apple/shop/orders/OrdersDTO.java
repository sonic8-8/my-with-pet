package com.apple.shop.orders;

import com.apple.shop.cart.Cart; // CartItem 클래스 import
import lombok.Data;
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


}