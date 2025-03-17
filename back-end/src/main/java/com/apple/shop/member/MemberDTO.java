package com.apple.shop.member;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class MemberDTO {
    @JsonProperty("id")
    private String id;

    @JsonProperty("pw")
    private String pw;

    @JsonProperty("name")
    private String name;

    @JsonProperty("phone")
    private String phone;

    @JsonProperty("role")
    private String role;

    @JsonProperty("joinedAt")
    private Instant joinedAt;
}
