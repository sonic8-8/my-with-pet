package com.apple.shop.storeMember;

import com.apple.shop.TestFixtures;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

/**
 * StoreMemberService 단위 테스트.
 * 점주 회원 관련 비즈니스 로직을 검증합니다.
 */
@ExtendWith(MockitoExtension.class)
class StoreMemberServiceTest {

    @Mock
    private StoreMemberRepository storeMemberRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private StoreMemberService storeMemberService;

    @Nested
    @DisplayName("registerMember 메서드는")
    class RegisterMember {

        @Test
        @DisplayName("신규 점주면 저장에 성공한다")
        void registerMember_whenNewMember_shouldSave() {
            // given
            StoreMember input = TestFixtures.createStoreMember("newceo", "rawPassword");
            given(storeMemberRepository.findById("newceo")).willReturn(Optional.empty());
            given(passwordEncoder.encode("rawPassword")).willReturn("encodedPw");

            // when
            storeMemberService.registerMember(input);

            // then
            verify(storeMemberRepository).save(any(StoreMember.class));
        }

        @Test
        @DisplayName("이미 존재하는 점주면 예외를 던진다")
        void registerMember_whenExistingMember_shouldThrow() {
            // given
            StoreMember input = TestFixtures.createStoreMember("existingceo", "rawPassword");
            StoreMember existing = TestFixtures.createStoreMember("existingceo", "encodedPw");
            given(storeMemberRepository.findById("existingceo")).willReturn(Optional.of(existing));

            // when & then
            assertThatThrownBy(() -> storeMemberService.registerMember(input))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("이미 존재하는 회원");

            verify(storeMemberRepository, never()).save(any(StoreMember.class));
        }
    }

    @Nested
    @DisplayName("checkDuplicateId 메서드는")
    class CheckDuplicateId {

        @Test
        @DisplayName("존재하는 아이디면 true를 반환한다")
        void checkDuplicateId_whenExists_shouldReturnTrue() {
            // given
            StoreMember existing = TestFixtures.createStoreMember("existingceo", "encodedPw");
            given(storeMemberRepository.findById("existingceo")).willReturn(Optional.of(existing));

            // when
            boolean result = storeMemberService.checkDuplicateId("existingceo");

            // then
            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("존재하지 않는 아이디면 false를 반환한다")
        void checkDuplicateId_whenNotExists_shouldReturnFalse() {
            // given
            given(storeMemberRepository.findById("newceo")).willReturn(Optional.empty());

            // when
            boolean result = storeMemberService.checkDuplicateId("newceo");

            // then
            assertThat(result).isFalse();
        }
    }

    @Nested
    @DisplayName("authenticate 메서드는")
    class Authenticate {

        @Test
        @DisplayName("올바른 자격증명이면 true를 반환한다")
        void authenticate_withValidCredentials_shouldReturnTrue() {
            // given
            StoreMember member = TestFixtures.createStoreMember("ceouser", "encodedPw");
            given(storeMemberRepository.findById("ceouser")).willReturn(Optional.of(member));
            given(passwordEncoder.matches("rawPassword", "encodedPw")).willReturn(true);

            // when
            boolean result = storeMemberService.authenticate("ceouser", "rawPassword");

            // then
            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("잘못된 비밀번호면 false를 반환한다")
        void authenticate_withInvalidPassword_shouldReturnFalse() {
            // given
            StoreMember member = TestFixtures.createStoreMember("ceouser", "encodedPw");
            given(storeMemberRepository.findById("ceouser")).willReturn(Optional.of(member));
            given(passwordEncoder.matches("wrongPassword", "encodedPw")).willReturn(false);

            // when
            boolean result = storeMemberService.authenticate("ceouser", "wrongPassword");

            // then
            assertThat(result).isFalse();
        }

        @Test
        @DisplayName("존재하지 않는 회원이면 예외를 던진다")
        void authenticate_whenMemberNotFound_shouldThrow() {
            // given
            given(storeMemberRepository.findById("unknown")).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> storeMemberService.authenticate("unknown", "password"))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("존재하지 않는 회원");
        }
    }

    @Nested
    @DisplayName("getMemberById 메서드는")
    class GetMemberById {

        @Test
        @DisplayName("존재하는 점주면 DTO를 반환한다")
        void getMemberById_whenMemberExists_shouldReturnDto() {
            // given
            StoreMember member = TestFixtures.createStoreMember("ceouser", "encodedPw");
            given(storeMemberRepository.findById("ceouser")).willReturn(Optional.of(member));

            // when
            StoreMemberDTO result = storeMemberService.getMemberById("ceouser");

            // then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo("ceouser");
            assertThat(result.getRole()).isEqualTo("ceo");
        }
    }
}
