package com.apple.shop.review;

import com.apple.shop.member.Member;
import com.apple.shop.store.Store;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
public class ReviewDTO {

    @JsonProperty("idx")
    private Long idx;

    @JsonProperty("memberIdx")
    private Long memberIdx;

    @JsonProperty("storeIdx")
    private Long storeIdx;

    @JsonProperty("title")
    private String title;

    @JsonProperty("content")
    private String content;

    @JsonProperty("ratings")
    private BigDecimal ratings;

    @JsonProperty("createdAt")
    private Instant createdAt;

    public ReviewDTO(Long idx, Long memberIdx, Long storeIdx,
            String title, String content, BigDecimal ratings, Instant createdAt) {
        this.idx = idx;
        this.memberIdx = memberIdx;
        this.storeIdx = storeIdx;
        this.title = title;
        this.content = content;
        this.ratings = ratings;
        this.createdAt = createdAt;
    }
}
