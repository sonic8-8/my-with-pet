package com.apple.shop.storeMember;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * 사업자(StoreMember) 테이블에서 인증 정보를 조회하는 서비스
 */
@Service("storeMemberUserDetailsService")
@RequiredArgsConstructor
public class StoreMemberUserDetailsService implements UserDetailsService {

    private final StoreMemberRepository storeMemberRepository;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        StoreMember storeMember = storeMemberRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("사업자를 찾을 수 없습니다: " + id));
        return new StoreMemberUserDetails(storeMember);
    }
}
