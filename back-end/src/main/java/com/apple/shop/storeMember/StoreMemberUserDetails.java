package com.apple.shop.storeMember;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

/**
 * 사업자(StoreMember) 인증 정보 래퍼
 */
@RequiredArgsConstructor
public class StoreMemberUserDetails implements UserDetails {

    private final StoreMember storeMember;

    /**
     * StoreMember 엔티티 접근자 (DTO 변환용)
     */
    public StoreMember getStoreMember() {
        return storeMember;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(() -> storeMember.getRole());
        return collection;
    }

    @Override
    public String getPassword() {
        return storeMember.getPw();
    }

    @Override
    public String getUsername() {
        return storeMember.getId();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
