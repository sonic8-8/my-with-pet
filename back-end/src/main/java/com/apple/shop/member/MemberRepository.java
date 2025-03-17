package com.apple.shop.member;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    Boolean existsById(String id);

    //id을 받아 DB 테이블에서 회원을 조회하는 메소드 작성
    Optional<Member> findById(String id);

    Optional<Member> findByIdx(Long idx);

}
