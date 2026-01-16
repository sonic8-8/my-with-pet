package com.apple.shop.storeMember;

import lombok.Getter;
import lombok.Setter;

/**
 * 가게 정보 저장 요청 DTO
 */
@Getter
@Setter
public class StoreInfoDTO {
    private String storeName;
    private String storePhone;
    private String storeAddr;
    private String storeNotice;
    private String businessHours;
    private String storeImg;
}
