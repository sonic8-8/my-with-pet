package com.apple.shop.address;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findAllByMemberIdx(Long idx);
    void deleteByIdx(Long idx);
    List<Address> findByMemberIdx(Long idx);
}
