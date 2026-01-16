package com.apple.shop.storeMember;

import com.apple.shop.member.Member;
import com.apple.shop.member.MemberDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class StoreMemberService {

    private final StoreMemberRepository storeMemberRepository;
    private final PasswordEncoder passwordEncoder;

    public void registerMember(StoreMember data) {
        StoreMember storeMember = new StoreMember();
        storeMember.setId(data.getId());
        String hash = passwordEncoder.encode(data.getPw());
        storeMember.setPw(hash);
        storeMember.setName(data.getName());
        storeMember.setPhone(data.getPhone());
        storeMember.setRole("ROLE_BUSINESS");
        storeMember.setJoinedAt(Instant.now());

        Optional<StoreMember> optional = storeMemberRepository.findById(data.getId());
        if (optional.isEmpty()) {
            storeMemberRepository.save(storeMember);
        } else {
            throw new RuntimeException("이미 존재하는 회원입니다.");
        }
    }

    public boolean checkDuplicateId(String id) {
        Optional<StoreMember> optional = storeMemberRepository.findById(id);
        return optional.isPresent(); // true면 중복된 아이디, false면 사용 가능한 아이디
    }

    public boolean authenticate(String id, String pw) {
        StoreMember storeMember = storeMemberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));

        return passwordEncoder.matches(pw, storeMember.getPw());
    }

    // 마이페이지 로직
    public StoreMemberDTO getMemberById(String id) {
        StoreMember storeMember = storeMemberRepository.findById(id).get();
        if (storeMember != null) {
            StoreMemberDTO storeMemberDTO = new StoreMemberDTO();
            storeMemberDTO.setId(storeMember.getId());
            storeMemberDTO.setName(storeMember.getName());
            storeMemberDTO.setPhone(storeMember.getPhone());
            storeMemberDTO.setRole(storeMember.getRole());
            return storeMemberDTO;
        }
        return null;
    }

}