package com.apple.shop.member;

import com.apple.shop.member.jwt.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private static final long JWT_EXPIRATION_MS = 3600000L; // 1시간
    private static final String DEFAULT_ROLE = "user";

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JWTUtil jwtUtil;

    public void registerMember(MemberDTO memberDTO) {
        if (isExistingMember(memberDTO.getId())) {
            return;
        }

        Member member = createMemberFromDTO(memberDTO);
        memberRepository.save(member);
    }

    public String login(MemberDTO memberDTO) {
        Optional<Member> memberOpt = memberRepository.findById(memberDTO.getId());

        if (memberOpt.isEmpty()) {
            return null;
        }

        Member member = memberOpt.get();
        if (isValidPassword(memberDTO.getPw(), member.getPw())) {
            return jwtUtil.createJwt(member.getId(), member.getRole(), JWT_EXPIRATION_MS);
        }

        return null;
    }

    public MemberDTO getMemberById(String id) {
        return memberRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    /**
     * 회원 ID 존재 여부를 확인합니다.
     */
    private boolean isExistingMember(String id) {
        return memberRepository.existsById(id);
    }

    /**
     * MemberDTO로부터 Member 엔티티를 생성합니다.
     */
    private Member createMemberFromDTO(MemberDTO dto) {
        Member member = new Member();
        member.setId(dto.getId());
        member.setPw(bCryptPasswordEncoder.encode(dto.getPw()));
        member.setName(dto.getName());
        member.setPhone(dto.getPhone());
        member.setRole(DEFAULT_ROLE);
        member.setJoinedAt(Instant.now());
        return member;
    }

    /**
     * 비밀번호 일치 여부를 검증합니다.
     */
    private boolean isValidPassword(String rawPassword, String encodedPassword) {
        return bCryptPasswordEncoder.matches(rawPassword, encodedPassword);
    }

    /**
     * Member 엔티티를 MemberDTO로 변환합니다.
     */
    private MemberDTO convertToDTO(Member member) {
        MemberDTO dto = new MemberDTO();
        dto.setId(member.getId());
        dto.setName(member.getName());
        dto.setPhone(member.getPhone());
        dto.setRole(member.getRole());
        return dto;
    }
}
