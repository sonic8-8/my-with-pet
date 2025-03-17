package com.apple.shop.cart;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Getter
@Setter
@Table(name = "cart")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_idx", columnDefinition = "int UNSIGNED not null")
    private Long idx;

    @Column(name = "cart_itemIdx", columnDefinition = "int UNSIGNED not null")
    private Long itemIdx;

    @Column(name = "cart_type", nullable = false, length = 20)
    private String type;

    @Column(name = "cart_name", nullable = false, length = 50)
    private String name;

    @Column(name = "cart_price", nullable = false)
    private Integer price;

    @Column(name = "cart_quantity", nullable = false)
    private Integer quantity;

    @Column(name = "cart_img", nullable = false, length = 1000)
    private String img;

    @Column(name = "cart_storeIdx", columnDefinition = "int UNSIGNED not null")
    private Long storeIdx;

    @Column(name = "cart_memberId", nullable = false, length = 50)
    private String memberId;
}
