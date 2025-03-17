package com.apple.shop.orders;

import com.apple.shop.cart.Cart;
import com.apple.shop.member.Member;
import com.apple.shop.store.Store;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "orders")
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_idx", columnDefinition = "int UNSIGNED not null")
    private Long idx;

    @Column(name = "member_idx", columnDefinition = "int UNSIGNED not null")
    private Long memberIdx;

    @Column(name = "store_idx", columnDefinition = "int UNSIGNED not null")
    private Long storeIdx;

    @Column(name = "pay_method", nullable = false, length = 10)
    private String payMethod;

    @Column(name = "pay_amount", nullable = false)
    private Integer payAmount;

    @Column(name = "order_status", nullable = false, length = 20)
    private String orderStatus;

    @CreatedDate
    @Column(name = "ordered_at", nullable = false)
    private Instant orderedAt;

    @Column(name = "recipient_name", nullable = false, length = 50)
    private String recipientName;

    @Column(name = "delivery_addr", nullable = false, length = 1000)
    private String deliveryAddr;

    @Column(name = "recipient_phone", nullable = false, length = 20)
    private String recipientPhone;

    @Column(name = "order_memo", nullable = false, length = 1000)
    private String orderMemo;

}