package com.apple.shop.storeMember;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class StoreMemberDTO {

    private Long idx;
    private String id;
    private String pw;
    private String name;
    private String phone;
    private Instant joinedAt;
    private String role;

}
