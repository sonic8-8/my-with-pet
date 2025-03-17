package com.apple.shop.storeMember;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoreMemberRepository extends JpaRepository<StoreMember, Long> {
    Optional<StoreMember> findById(String id);
    StoreMember getMemberById(String id);

}
