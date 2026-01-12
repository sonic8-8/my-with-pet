package com.apple.shop.member;

import com.apple.shop.TestFixtures;
import com.apple.shop.member.jwt.JWTUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

/**
 * MemberService 단위 테스트.
 * 의존성은 Mock으로 대체하여 순수 비즈니스 로직만 검증합니다.
 */
@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Mock
    private JWTUtil jwtUtil;

    @InjectMocks
    private MemberService memberService;

    @Nested
    @DisplayName("registerMember 메서드는")
    class RegisterMember {

        @Test
        @DisplayName("신규 회원이면 저장에 성공한다")
        void registerMember_whenNewMember_shouldSave() {
            // given
            MemberDTO dto = TestFixtures.createMemberDTO("newuser", "password123");
            given(memberRepository.existsById("newuser")).willReturn(false);
            given(bCryptPasswordEncoder.encode("password123")).willReturn("encodedPw");

            // when
            memberService.registerMember(dto);

            // then
            verify(memberRepository).save(any(Member.class));
        }

        @Test
        @DisplayName("이미 존재하는 회원이면 저장하지 않는다")
        void registerMember_whenExistingMember_shouldNotSave() {
            // given
            MemberDTO dto = TestFixtures.createMemberDTO("existinguser", "password123");
            given(memberRepository.existsById("existinguser")).willReturn(true);

            // when
            memberService.registerMember(dto);

            // then
            verify(memberRepository, never()).save(any(Member.class));
        }
    }

    @Nested
    @DisplayName("login 메서드는")
    class Login {

        @Test
        @DisplayName("올바른 자격증명이면 JWT를 반환한다")
        void login_withValidCredentials_shouldReturnJwt() {
            // given
            MemberDTO dto = TestFixtures.createMemberDTO("testuser", "password123");
            Member member = TestFixtures.createMember("testuser", "encodedPw");

            given(memberRepository.findById("testuser")).willReturn(Optional.of(member));
            given(bCryptPasswordEncoder.matches("password123", "encodedPw")).willReturn(true);
            given(jwtUtil.createJwt(anyString(), anyString(), any(Long.class)))
                    .willReturn("generated.jwt.token");

            // when
            String result = memberService.login(dto);

            // then
            assertThat(result).isEqualTo("generated.jwt.token");
        }

        @Test
        @DisplayName("잘못된 비밀번호면 null을 반환한다")
        void login_withInvalidPassword_shouldReturnNull() {
            // given
            MemberDTO dto = TestFixtures.createMemberDTO("testuser", "wrongpassword");
            Member member = TestFixtures.createMember("testuser", "encodedPw");

            given(memberRepository.findById("testuser")).willReturn(Optional.of(member));
            given(bCryptPasswordEncoder.matches("wrongpassword", "encodedPw")).willReturn(false);

            // when
            String result = memberService.login(dto);

            // then
            assertThat(result).isNull();
        }
    }

    @Nested
    @DisplayName("getMemberById 메서드는")
    class GetMemberById {

        @Test
        @DisplayName("존재하는 회원이면 DTO를 반환한다")
        void getMemberById_whenMemberExists_shouldReturnDto() {
            // given
            Member member = TestFixtures.createMember("testuser", "encodedPw", "홍길동");
            given(memberRepository.findById("testuser")).willReturn(Optional.of(member));

            // when
            MemberDTO result = memberService.getMemberById("testuser");

            // then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo("testuser");
            assertThat(result.getName()).isEqualTo("홍길동");
        }
    }
}
