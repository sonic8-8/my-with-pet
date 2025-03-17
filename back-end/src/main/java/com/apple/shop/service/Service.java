package com.apple.shop.service;

import com.apple.shop.store.Store;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "service")
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_idx", columnDefinition = "int UNSIGNED not null")
    private Long idx;

    @Column(name = "service_type", nullable = false, length = 20)
    private String type;

    @Column(name = "service_menu", nullable = false, length = 50)
    private String menu;

    @Column(name = "service_price", nullable = false)
    private Integer price;

    @Column(name = "service_img", nullable = false, length = 1000)
    private String img;

    @Lob
    @Column(name = "service_info", nullable = false)
    private String info;

    @Column(name = "reserved_time", nullable = false)
    private Instant reservedTime;

    @Column(name = "mem_id", nullable = false, length = 30)
    private String memId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "store_idx", nullable = false,
            foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Store store;

}