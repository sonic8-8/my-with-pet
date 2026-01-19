package com.apple.shop.member;

import lombok.Builder;
import lombok.Getter;

/**
 * 회원 정보 응답 DTO
 * 비밀번호 등 민감 정보 제외
 */
@Getter
@Builder
public class MemberResponseDTO {

    private final Long idx;
    private final String id;
    private final String name;
    private final String phone;
    private final String role;

    public static MemberResponseDTO from(Member member) {
        return MemberResponseDTO.builder()
                .idx(member.getIdx())
                .id(member.getId())
                .name(member.getName())
                .phone(member.getPhone())
                .role(member.getRole())
                .build();
    }
}
