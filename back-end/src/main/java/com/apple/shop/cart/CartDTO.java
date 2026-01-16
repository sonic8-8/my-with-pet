package com.apple.shop.cart;

import lombok.Getter;
import lombok.Setter;

/**
 * 장바구니 추가 요청 DTO
 * memberId는 JWT 토큰에서 추출하므로 포함하지 않음
 */
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
}
