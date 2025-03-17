package com.apple.shop.item;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@RequiredArgsConstructor
@ToString
public class ItemDTO {

    @JsonProperty("name")
    private String name;

    @JsonProperty("price")
    private Integer price;

    @JsonProperty("img")
    private String img;

    @JsonProperty("info")
    private String info;

    @JsonProperty("stock")
    private Integer stock;

    @JsonProperty("storeIdx")
    private Long storeIdx;

    public ItemDTO(String name, Integer price, String img
    , String info, Integer stock, Long storeIdx) {
        this.name = name;
        this.price = price;
        this.img = img;
        this.info = info;
        this.stock = stock;
        this.storeIdx = storeIdx;
    }
}
