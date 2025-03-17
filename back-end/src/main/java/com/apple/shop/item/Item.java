package com.apple.shop.item;

import com.apple.shop.store.Store;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "item")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_idx", columnDefinition = "int UNSIGNED not null")
    private Long idx;

    @Column(name = "item_type", nullable = false, length = 20)
    private String type;

    @Column(name = "item_name", nullable = false, length = 50)
    private String name;

    @Column(name = "item_price", nullable = false)
    private Integer price;

    @Column(name = "item_img", nullable = false, length = 1000)
    private String img;

    @Lob
    @Column(name = "item_info", nullable = false)
    private String info;

    @ColumnDefault("10")
    @Column(name = "item_stock", nullable = false)
    private Integer stock;

    @Column(name = "item_storeIdx", columnDefinition = "int UNSIGNED not null")
    private Long storeIdx;
}