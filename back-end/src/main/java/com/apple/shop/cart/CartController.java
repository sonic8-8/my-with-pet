package com.apple.shop.cart;

import com.apple.shop.item.Item;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final CartRepository cartRepository;

    @PostMapping("/cart/add")
    public void addCart(@RequestBody Cart cart) {
        // item의 모든 정보를 받아와서 카트에 저장할 것임
        cartRepository.save(cart);
    }
}
