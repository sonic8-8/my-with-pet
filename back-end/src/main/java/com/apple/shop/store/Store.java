package com.apple.shop.store;

import com.apple.shop.item.Item;
import com.apple.shop.like.Like;
import com.apple.shop.orders.Orders;
import com.apple.shop.pickupService.PickupService;
import com.apple.shop.review.Review;
import com.apple.shop.service.Service;
import com.apple.shop.storeMember.StoreMember;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "store")
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "store_idx", columnDefinition = "int UNSIGNED not null")
    private Long idx;

    @Column(name = "store_star", nullable = false)
    private Integer star;

    @Column(name = "store_deliveryfee", nullable = false)
    private Integer deliveryFee;

    @Column(name = "store_type", nullable = false)
    private Integer type;

    @Column(name = "store_name", nullable = false, length = 50)
    private String name;

    @Column(name = "store_addr", nullable = false, length = 1000)
    private String addr;

    @Column(name = "store_notice", nullable = false, length = 1000)
    private String notice;

    @Column(name = "store_tel", nullable = false, length = 20)
    private String tel;

    @Column(name = "store_bno", nullable = false, length = 10)
    private String bno;

    @Column(name = "store_auth", nullable = false)
    private Boolean auth;

    @Column(name = "loc", nullable = false, precision = 17, scale = 14)
    private BigDecimal loc;

    @Column(name = "lng", nullable = false, precision = 17, scale = 14)
    private BigDecimal lng;

    @Lob
    @Column(name = "store_info", nullable = false)
    private String info;

    @Column(name = "store_logo", nullable = false, length = 1000)
    private String logo;

    @Column(name = "store_status", nullable = false, length = 10)
    private String status;

    @Column(name = "running_time", nullable = false, length = 20)
    private String runningTime;

    @Column(name = "pause_time", nullable = false, length = 20)
    private String pauseTime;

    @Column(name = "holiday", nullable = false, length = 30)
    private String holiday;

    @OneToMany(mappedBy = "store")
    private Set<Like> likeSet = new LinkedHashSet<>();

    @OneToMany(mappedBy = "store")
    private Set<PickupService> pickupServiceSet = new LinkedHashSet<>();

    @OneToMany(mappedBy = "store")
    private Set<Service> serviceSet = new LinkedHashSet<>();

    @Column(name = "mem_idx", columnDefinition = "int UNSIGNED not null")
    private Long storeMemberIdx;

}