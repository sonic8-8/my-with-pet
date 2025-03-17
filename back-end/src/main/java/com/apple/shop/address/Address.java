package com.apple.shop.address;

import com.apple.shop.member.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "address")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "addr_idx", columnDefinition = "int UNSIGNED not null")
    private Long idx;

    @Column(name = "mem_idx", columnDefinition = "int UNSIGNED not null")
    private Long memberIdx;

    @Column(name = "mem_addr", nullable = false, length = 1000)
    private String addr;

    @Column(name = "mem_isCurrent", nullable = false, columnDefinition = "boolean default false")
    private Boolean isCurrent;

}