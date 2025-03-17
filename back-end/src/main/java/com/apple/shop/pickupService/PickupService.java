package com.apple.shop.pickupService;

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
@Table(name = "pickup_service")
public class PickupService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pickup_idx", columnDefinition = "int UNSIGNED not null")
    private Long idx;

    @Column(name = "distance", nullable = false)
    private Integer distance;

    @Column(name = "price_per_dist", nullable = false)
    private Integer pricePerDist;

    @Column(name = "reserved_time", nullable = false)
    private Instant reservedTime;

    @Lob
    @Column(name = "pickup_detail", nullable = false)
    private String pickupDetail;

    @Column(name = "pickup_img", nullable = false, length = 1000)
    private String img;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "store_idx", nullable = false,
            foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Store store;
}