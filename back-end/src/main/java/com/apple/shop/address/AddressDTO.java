package com.apple.shop.address;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@RequiredArgsConstructor
@ToString
@Getter
@Setter
public class AddressDTO {

    @JsonProperty("address")
    private String address;

    @JsonProperty("memberId")
    private String memberId;

}
