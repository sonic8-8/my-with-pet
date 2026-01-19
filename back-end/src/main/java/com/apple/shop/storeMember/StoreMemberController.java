package com.apple.shop.storeMember;

import com.apple.shop.member.jwt.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/business/")
@ResponseBody
public class StoreMemberController {

    private final StoreMemberService storeMemberService;
    private final JWTUtil jwtUtil;

    @PostMapping("/sign-up")
    public String join(@RequestBody StoreMember storeMember) {

        if (storeMemberService.checkDuplicateId(storeMember.getId())) {
            return "이미 등록된 아이디입니다.";
        }
        storeMemberService.registerMember(storeMember);
        return "회원가입 성공";
    }

    // login() 메서드 삭제됨 - StoreMemberLoginFilter 방식으로 통일 (Plan-30)

    /**
     * 현재 로그인한 사업자 정보 조회
     * Plan-31: StoreMemberResponseDTO로 반환하여 민감정보 노출 방지
     */
    @GetMapping("/current-user")
    public ResponseEntity<StoreMemberResponseDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof StoreMemberUserDetails userDetails) {
            StoreMember storeMember = userDetails.getStoreMember();
            return ResponseEntity.ok(StoreMemberResponseDTO.from(storeMember));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/mypage")
    public ResponseEntity<StoreMemberDTO> getMyInfo(HttpServletRequest request) {
        try {
            String authorization = request.getHeader("Authorization");
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            String token = authorization.substring(7);
            String id = jwtUtil.getId(token);
            StoreMemberDTO storeMemberDTO = storeMemberService.getMemberById(id);
            return ResponseEntity.ok(storeMemberDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 사업자등록번호 인증
     * TODO: 실제 국세청 API 연동 필요
     */
    @PostMapping("/verify")
    public ResponseEntity<java.util.Map<String, Boolean>> verifyBusinessNumber(
            @RequestBody java.util.Map<String, java.util.List<String>> request) {
        java.util.List<String> businessNumbers = request.get("b_no");

        if (businessNumbers == null || businessNumbers.isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("valid", false));
        }

        // TODO: 실제 사업자번호 검증 API 연동 (국세청 API 등)
        // 현재는 더미 검증 (10자리 숫자 체크)
        String bNo = businessNumbers.get(0);
        boolean valid = bNo != null && bNo.matches("\\d{10}");

        return ResponseEntity.ok(java.util.Map.of("valid", valid));
    }

    /**
     * 가게 정보 저장
     * TODO: Store 엔티티에 저장 로직 구현
     */
    @PostMapping("/storeinfo")
    public ResponseEntity<String> saveStoreInfo(
            @RequestBody StoreInfoDTO storeInfo,
            HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // TODO: Store 엔티티에 저장 로직 구현
        // 현재는 성공 응답만 반환
        return ResponseEntity.ok("가게 정보가 저장되었습니다.");
    }

}
