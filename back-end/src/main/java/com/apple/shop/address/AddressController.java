package com.apple.shop.address;

import com.apple.shop.member.Member;
import com.apple.shop.member.MemberRepository;
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

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;
    private final AddressRepository addressRepository;
    private final MemberRepository memberRepository;
    private final JWTUtil jwtUtil;
    private final MemberService memberService;

    @GetMapping("/address")
    public ResponseEntity<?> getAddress(@RequestParam String memberId) {
        try {
            Long memberIdx = findMemberIdxById(memberId);
            List<Address> addressList = addressRepository.findByMemberIdx(memberIdx);
            return ResponseEntity.ok(addressList);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching addresses");
        }
    }

    @PostMapping("/address-add")
    public ResponseEntity<Address> addAddress(@RequestBody AddressDTO addressDTO) {
        Optional<Member> memberOpt = memberRepository.findById(addressDTO.getMemberId());

        if (memberOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Address address = createAddressFromDTO(addressDTO, memberOpt.get().getIdx());
        addressRepository.save(address);

        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(address);
    }

    @DeleteMapping("/address-delete/{addressIdx}")
    public void deleteAddress(@PathVariable Long addressIdx) {
        addressRepository.deleteByIdx(addressIdx);
    }

    @PostMapping("/address-update")
    public ResponseEntity<String> updateAllAddresses(@RequestBody Map<String, String> data) {
        String loginedId = data.get("userId");
        String address = data.get("address");

        Optional<Member> memberOpt = memberRepository.findById(loginedId);
        if (memberOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Member not found: " + loginedId);
        }

        List<Address> existingAddresses = addressRepository.findByMemberIdx(memberOpt.get().getIdx());
        if (existingAddresses.isEmpty()) {
            return ResponseEntity.badRequest().body("No address found for user ID: " + loginedId);
        }

        existingAddresses.forEach(addr -> addr.setAddr(address));
        addressRepository.saveAll(existingAddresses);

        return ResponseEntity.ok("Address updated successfully");
    }

    @PostMapping("/memberinfo")
    public ResponseEntity<Member> getMemberInfo(@RequestBody Map<String, String> data) {
        String loginedId = data.get("userid");
        Optional<Member> memberOpt = memberRepository.findById(loginedId);

        return memberOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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
