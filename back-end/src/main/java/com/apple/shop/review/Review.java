package com.apple.shop.review;

import com.apple.shop.store.Store;
import com.apple.shop.member.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "review")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_idx", columnDefinition = "int UNSIGNED not null")
    private Long idx;

    @Column(name = "review_memberId", nullable = false, length = 100)
    private String memberId;

    @Column(name = "review_memberIdx", columnDefinition = "int UNSIGNED not null")
    private Long memberIdx;

    @Column(name = "review_storeIdx", columnDefinition = "int UNSIGNED not null")
    private Long storeIdx;

    @Column(name = "review_title", nullable = false, length = 100)
    private String title;

    @Column(name = "review_content", nullable = false, length = 900)
    private String content;

    @Column(name = "ratings", nullable = false, precision = 2, scale = 1)
    private BigDecimal ratings;

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

}