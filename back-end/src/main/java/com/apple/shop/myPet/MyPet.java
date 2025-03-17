package com.apple.shop.myPet;

import com.apple.shop.member.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "my_pet")
public class MyPet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pet_idx", columnDefinition = "int UNSIGNED not null")
    private Long idx;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mem_idx", nullable = false,
            foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Member member;

    @Column(name = "pet_type", nullable = false, length = 50)
    private String type;

    @Column(name = "pet_breed", nullable = false, length = 50)
    private String breed;

    @Column(name = "pet_weight", nullable = false, precision = 12, scale = 1)
    private BigDecimal weight;

    @Column(name = "pet_img", nullable = false, length = 1000)
    private String img;

}