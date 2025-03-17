package com.apple.shop.member;

import com.apple.shop.member.jwt.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JWTUtil jwtUtil;


    public void registerMember(MemberDTO memberDTO) {

        String id = memberDTO.getId();
        String pw = memberDTO.getPw();
        String name = memberDTO.getName();
        String phone = memberDTO.getPhone();
        Instant joinedAt = Instant.now();

        Boolean isExist = memberRepository.existsById(id);

        if (isExist) {

            return;
        }

        Member data = new Member();
        data.setId(id);
        data.setPw(bCryptPasswordEncoder.encode(pw));
        data.setName(name);
        data.setPhone(phone);
        data.setRole("user");
        data.setJoinedAt(joinedAt);

        memberRepository.save(data);
    }

    // 로그인 로직
    public String login(MemberDTO memberDTO) {
        String id = memberDTO.getId();
        String pw = memberDTO.getPw();

        Member member = memberRepository.findById(id).get();

        System.out.println("프론트앤드 id : " + member);
        System.out.println(bCryptPasswordEncoder.matches(pw, member.getPw()));
        // 회원이 존재하고 비밀번호가 일치하는지 확인
        if (member != null && bCryptPasswordEncoder.matches(pw, member.getPw())) {
            // JWT 생성
            return jwtUtil.createJwt(id, member.getRole(), 3600000L); // 1시간 유효 기간
        } else {
            return null;
        }
    }

    // 마이페이지 로직
    public MemberDTO getMemberById(String id) {
        Member member = memberRepository.findById(id).get();
        if (member != null) {
            MemberDTO memberDTO = new MemberDTO();
            memberDTO.setId(member.getId());
            memberDTO.setName(member.getName());
            memberDTO.setPhone(member.getPhone());
            memberDTO.setRole(member.getRole());
            return memberDTO;
        }
        return null;
    }

}
