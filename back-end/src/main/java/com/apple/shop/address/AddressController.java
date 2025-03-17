package com.apple.shop.address;

import com.apple.shop.member.Member;
import com.apple.shop.member.MemberDTO;
import com.apple.shop.member.MemberRepository;
import com.apple.shop.member.MemberService;
import com.apple.shop.member.jwt.JWTUtil;
import com.apple.shop.orders.Orders;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

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
            Long memberIdx = memberRepository.findById(memberId)
                    .orElseThrow(() -> new NoSuchElementException("Member not found with id: " + memberId))
                    .getIdx();

            List<Address> addressList = addressRepository.findByMemberIdx(memberIdx);
            return ResponseEntity.ok(addressList);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching addresses");
        }

    }

    @PostMapping("/address-add")
    public ResponseEntity<Address> addAddress(@RequestBody AddressDTO addressDTO) {

        System.out.println(addressDTO);

        String memberId = addressDTO.getMemberId();
        String requestAddr = addressDTO.getAddress();

        Member nowLogined = null;

        try {
            nowLogined = memberRepository.findById(memberId).get();
        }
        catch (Exception e) {
            e.printStackTrace();
            System.out.println("null값임");
        }

        Address address = new Address();
        address.setMemberIdx(nowLogined.getIdx());
        address.setAddr(requestAddr);

        addressRepository.save(address);

        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(address);
    }

    @DeleteMapping("/address-delete/{addressIdx}")
    public void deleteAddress(@PathVariable Long addressIdx) {

        addressRepository.deleteByIdx(addressIdx);
        // 삭제 성공 시 별도의 응답 없음 (200 OK 암묵적으로 반환)
    }

    @PostMapping("/address-add1")
    public ResponseEntity<String> addAddress1(@RequestBody Map<String, String> data) {
        String loginedId = data.get("userId");
        String address = data.get("address");

        Long loginedIdx = memberRepository.findById(loginedId).get().getIdx();
        List<Address> existingAddresses = addressRepository.findByMemberIdx(loginedIdx);

        if (existingAddresses.isEmpty()) {
            return ResponseEntity.badRequest().body("No address found for user ID: " + loginedId);
        }

        for (Address addr : existingAddresses) {
            addr.setAddr(address);
        }

        addressRepository.saveAll(existingAddresses);

        return ResponseEntity.ok("Address updated successfully");
    }

    @PostMapping("/memberinfo")
    public Member getMemberInfo(@RequestBody Map<String, String> data) {
        String loginedId = data.get("userid");
        System.out.println(loginedId);

        Member member = memberRepository.findById(loginedId).get();
        return member;
    }



}
