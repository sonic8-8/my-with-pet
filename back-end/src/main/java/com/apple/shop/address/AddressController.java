package com.apple.shop.address;

import com.apple.shop.member.Member;
import com.apple.shop.member.MemberRepository;
import com.apple.shop.member.MemberResponseDTO;
import com.apple.shop.member.MemberService;
import com.apple.shop.member.jwt.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

/**
 * 주소 관리 API 컨트롤러
 * ADR-002: JWT 토큰 기반 사용자 검증으로 IDOR 취약점 해결
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AddressController {

    private static final String BEARER_PREFIX = "Bearer ";

    private final AddressService addressService;
    private final AddressRepository addressRepository;
    private final MemberRepository memberRepository;
    private final JWTUtil jwtUtil;
    private final MemberService memberService;

    /**
     * 현재 로그인한 사용자의 주소 목록 조회
     * ADR-002: JWT 토큰에서 사용자 ID 추출 (IDOR 방지)
     */
    @GetMapping("/address")
    public ResponseEntity<?> getAddress(@RequestHeader("Authorization") String token) {
        try {
            String memberId = extractMemberIdFromToken(token);
            Long memberIdx = findMemberIdxById(memberId);
            List<Address> addressList = addressRepository.findByMemberIdx(memberIdx);
            return ResponseEntity.ok(addressList);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or missing token");
        }
    }

    /**
     * 주소 추가
     * ADR-002: JWT 토큰에서 사용자 ID 추출 (IDOR 방지)
     */
    @PostMapping("/address-add")
    public ResponseEntity<?> addAddress(
            @RequestHeader("Authorization") String token,
            @RequestBody AddressDTO addressDTO) {
        try {
            String memberId = extractMemberIdFromToken(token);
            Optional<Member> memberOpt = memberRepository.findById(memberId);

            if (memberOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Member not found");
            }

            Address address = createAddressFromDTO(addressDTO, memberOpt.get().getIdx());
            addressRepository.save(address);

            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(address);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or missing token");
        }
    }

    /**
     * 주소 삭제
     * ADR-002: 소유자 검증 추가 (IDOR 방지)
     */
    @DeleteMapping("/address-delete/{addressIdx}")
    public ResponseEntity<?> deleteAddress(
            @PathVariable Long addressIdx,
            @RequestHeader("Authorization") String token) {
        try {
            String memberId = extractMemberIdFromToken(token);
            Long memberIdx = findMemberIdxById(memberId);

            // 해당 주소가 현재 사용자 소유인지 확인
            Optional<Address> addressOpt = addressRepository.findById(addressIdx);
            if (addressOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Address not found");
            }

            if (!addressOpt.get().getMemberIdx().equals(memberIdx)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You can only delete your own addresses");
            }

            addressRepository.deleteByIdx(addressIdx);
            return ResponseEntity.ok("Address deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or missing token");
        }
    }

    /**
     * 주소 업데이트
     * ADR-002: JWT 토큰에서 사용자 ID 추출 (IDOR 방지)
     */
    @PostMapping("/address-update")
    public ResponseEntity<String> updateAllAddresses(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> data) {
        try {
            String memberId = extractMemberIdFromToken(token);
            String address = data.get("address");

            Optional<Member> memberOpt = memberRepository.findById(memberId);
            if (memberOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Member not found");
            }

            List<Address> existingAddresses = addressRepository.findByMemberIdx(memberOpt.get().getIdx());
            if (existingAddresses.isEmpty()) {
                return ResponseEntity.badRequest().body("No address found for user");
            }

            existingAddresses.forEach(addr -> addr.setAddr(address));
            addressRepository.saveAll(existingAddresses);

            return ResponseEntity.ok("Address updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or missing token");
        }
    }

    /**
     * 회원 정보 조회
     * ADR-002: JWT 토큰에서 사용자 ID 추출 (IDOR 방지)
     * Plan-31: MemberResponseDTO로 반환하여 민감정보 노출 방지
     */
    @PostMapping("/memberinfo")
    public ResponseEntity<?> getMemberInfo(@RequestHeader("Authorization") String token) {
        try {
            String memberId = extractMemberIdFromToken(token);
            Optional<Member> memberOpt = memberRepository.findById(memberId);

            return memberOpt
                    .map(member -> ResponseEntity.ok(MemberResponseDTO.from(member)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or missing token");
        }
    }

    /**
     * JWT 토큰에서 사용자 ID 추출
     */
    private String extractMemberIdFromToken(String token) {
        if (token == null || !token.startsWith(BEARER_PREFIX)) {
            throw new IllegalArgumentException("Invalid token format");
        }
        return jwtUtil.getId(token.substring(BEARER_PREFIX.length()));
    }

    /**
     * 회원 ID로 회원 인덱스를 조회합니다.
     */
    private Long findMemberIdxById(String memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new NoSuchElementException("Member not found with id: " + memberId))
                .getIdx();
    }

    /**
     * AddressDTO로부터 Address 엔티티를 생성합니다.
     */
    private Address createAddressFromDTO(AddressDTO dto, Long memberIdx) {
        Address address = new Address();
        address.setMemberIdx(memberIdx);
        address.setAddr(dto.getAddress());
        return address;
    }
}
