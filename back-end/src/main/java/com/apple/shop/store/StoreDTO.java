package com.apple.shop.store;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.ToString;

import java.math.BigDecimal;

@ToString
public class StoreDTO {

    @JsonProperty("name")
    private String name;

    @JsonProperty("star")
    private Integer star;

    @JsonProperty("deliveryFee")
    private Integer deliveryFee;

    @JsonProperty("logo")
    private String logo;

    @JsonProperty("auth")
    private Boolean auth;

    @JsonProperty("idx")
    private Long idx;

    @JsonProperty("type")
    private Integer type;

    @JsonProperty("addr")
    private String addr;

    @JsonProperty("notice")
    private String notice;

    @JsonProperty("tel")
    private String tel;

    @JsonProperty("bno")
    private String bno;

    @JsonProperty("loc")
    private BigDecimal loc;

    @JsonProperty("lng")
    private BigDecimal lng;

    @JsonProperty("info")
    private String info;

    @JsonProperty("status")
    private String status;

    @JsonProperty("runningTime")
    private String runningTime;

    @JsonProperty("pauseTime")
    private String pauseTime;

    @JsonProperty("holiday")
    private String holiday;


    public StoreDTO(Long idx, String name, Integer star, Integer deliveryFee, String logo, Boolean auth) {
        this.idx = idx;
        this.name = name;
        this.star = star;
        this.deliveryFee = deliveryFee;
        this.logo = logo;
        this.auth = auth;
    }

    public StoreDTO(Long idx, String name, String logo,
                    Boolean auth, String addr, String notice,
                    String tel, String bno, BigDecimal loc,
                    BigDecimal lng, String info, String status,
                    String runningTime, String pauseTime, String holiday,
                    Integer deliveryFee, Integer star) {
        this.idx = idx;
        this.name = name;
        this.logo = logo;
        this.auth = auth;
        this.addr = addr;
        this.notice = notice;
        this.tel = tel;
        this.bno = bno;
        this.loc = loc;
        this.lng = lng;
        this.info = info;
        this.status = status;
        this.runningTime = runningTime;
        this.pauseTime = pauseTime;
        this.holiday = holiday;
        this.deliveryFee = deliveryFee;
        this.star = star;
    }

}