package com.apple.shop.cart;

import com.apple.shop.member.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final CartRepository cartRepository;

    /**
     * 장바구니 추가 - JWT 토큰에서 memberId 추출 (IDOR 방지)
     */
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
        cart.setMemberId(userDetails.getUsername()); // JWT에서 추출한 사용자 ID

        cartRepository.save(cart);
        return ResponseEntity.ok("장바구니에 추가되었습니다.");
    }

    /**
     * 장바구니 목록 조회 - JWT 토큰에서 memberId 추출 (IDOR 방지)
     */
    @GetMapping("/cart")
    public ResponseEntity<List<Cart>> getCart(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String memberId = userDetails.getUsername();
        List<Cart> cartItems = cartRepository.findByMemberId(memberId);
        return ResponseEntity.ok(cartItems);
    }

    /**
     * 장바구니 아이템 삭제
     */
    @DeleteMapping("/cart/{idx}")
    public ResponseEntity<String> deleteCartItem(
            @PathVariable Long idx,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 해당 카트 아이템이 현재 사용자 소유인지 확인
        Cart cart = cartRepository.findById(idx).orElse(null);
        if (cart == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        if (!cart.getMemberId().equals(userDetails.getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        cartRepository.deleteById(idx);
        return ResponseEntity.ok("삭제되었습니다.");
    }
}
