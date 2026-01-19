package com.apple.shop.storeMember;

import lombok.Builder;
import lombok.Getter;

/**
 * 사업자 회원 정보 응답 DTO
 * 비밀번호 등 민감 정보 제외
 */
@Getter
@Builder
public class StoreMemberResponseDTO {

    private final Long idx;
    private final String id;
    private final String name;
    private final String phone;
    private final String role;

    public static StoreMemberResponseDTO from(StoreMember storeMember) {
        return StoreMemberResponseDTO.builder()
                .idx(storeMember.getIdx())
                .id(storeMember.getId())
                .name(storeMember.getName())
                .phone(storeMember.getPhone())
                .role(storeMember.getRole())
                .build();
    }
}
