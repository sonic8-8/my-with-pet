package com.apple.shop.storeMember;

import com.apple.shop.store.Store;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "store_member")
public class StoreMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mem_idx", columnDefinition = "int UNSIGNED not null")
    private Long idx;

    @Column(name = "mem_id", nullable = false, length = 30)
    private String id;

    @JsonIgnore
    @Column(name = "mem_pw", nullable = false, length = 96)
    private String pw;

    @Column(name = "mem_name", nullable = false, length = 50)
    private String name;

    @Column(name = "mem_phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "joined_at", nullable = false)
    private Instant joinedAt;

    @Column(name = "mem_role", nullable = false)
    private String role;
}