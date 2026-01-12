package com.apple.shop;

import com.apple.shop.member.Member;
import com.apple.shop.member.MemberDTO;
import com.apple.shop.storeMember.StoreMember;

import java.time.Instant;

/**
 * 테스트용 픽스처(Fixture) 빌더 클래스.
 * 테스트에서 사용할 엔티티와 DTO 객체를 일관된 방식으로 생성합니다.
 */
public class TestFixtures {

    // ==================== Member 관련 ====================

    public static Member createMember(String id, String encodedPassword) {
        Member member = new Member();
        member.setId(id);
        member.setPw(encodedPassword);
        member.setName("테스트 사용자");
        member.setPhone("010-1234-5678");
        member.setRole("user");
        member.setJoinedAt(Instant.now());
        return member;
    }

    public static Member createMember(String id, String encodedPassword, String name) {
        Member member = createMember(id, encodedPassword);
        member.setName(name);
        return member;
    }

    public static MemberDTO createMemberDTO(String id, String rawPassword) {
        MemberDTO dto = new MemberDTO();
        dto.setId(id);
        dto.setPw(rawPassword);
        dto.setName("테스트 사용자");
        dto.setPhone("010-1234-5678");
        return dto;
    }

    // ==================== StoreMember 관련 ====================

    public static StoreMember createStoreMember(String id, String encodedPassword) {
        StoreMember storeMember = new StoreMember();
        storeMember.setId(id);
        storeMember.setPw(encodedPassword);
        storeMember.setName("테스트 점주");
        storeMember.setPhone("010-9876-5432");
        storeMember.setRole("ceo");
        storeMember.setJoinedAt(Instant.now());
        return storeMember;
    }

    // ==================== 상수 ====================

    public static final String DEFAULT_RAW_PASSWORD = "password123";
    public static final String DEFAULT_ENCODED_PASSWORD = "$2a$10$encodedPasswordHash";
}
