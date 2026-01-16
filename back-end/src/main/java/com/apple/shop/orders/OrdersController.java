package com.apple.shop.orders;

import com.apple.shop.member.CustomUserDetails;
import com.apple.shop.member.Member;
import com.apple.shop.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrdersController {

    private final OrdersService ordersService;
    private final OrdersRepository ordersRepository;
    private final MemberRepository memberRepository;

    @PostMapping("/order")
    public ResponseEntity<String> saveOrder(
            @RequestBody OrdersDTO data,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        // TODO: 주문 저장 로직 구현 (Plan-27)
        return ResponseEntity.ok("주문이 완료되었습니다.");
    }

    /**
     * 주문 이력 조회 - JWT 토큰에서 사용자 ID 추출 (IDOR 방지)
     */
    @GetMapping("/orders/history")
    public ResponseEntity<List<Orders>> loadOrderHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String userId = userDetails.getUsername();
        Member member = memberRepository.findById(userId).orElse(null);

        if (member == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<Orders> orders = ordersRepository.findByMemberIdx(member.getIdx());
        return ResponseEntity.ok(orders);
    }
}
