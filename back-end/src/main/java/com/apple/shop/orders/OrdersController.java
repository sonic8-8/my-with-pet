package com.apple.shop.orders;

import com.apple.shop.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrdersController {

    private final OrdersService ordersService;
    private final OrdersRepository ordersRepository;
    private final MemberRepository memberRepository;

    @PostMapping("/order")
    public void SaveOrder(@RequestBody OrdersDTO data) {

    }

    @PostMapping("/orders/orderhistory")
    public List<Orders> loadOrderHistory(@RequestBody Map<String, String> data) {
        String userId = data.get("userId");

        Long userIdx = memberRepository.findById(userId).get().getIdx();
        List<Orders> orders = ordersRepository.findByMemberIdx(userIdx);

        return orders;
    }
}
