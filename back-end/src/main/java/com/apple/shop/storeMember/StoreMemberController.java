package com.apple.shop.storeMember;

import com.apple.shop.member.MemberDTO;
import com.apple.shop.member.jwt.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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

        if(storeMemberService.checkDuplicateId(storeMember.getId())){
            return "이미 등록된 아이디입니다.";
        }
        storeMemberService.registerMember(storeMember);
        return "회원가입 성공";
    }

    @PostMapping("/login")
    public String login(@RequestBody StoreMember request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        if (storeMemberService.authenticate(request.getId(), request.getPw())) {
            return "로그인 성공";
        } else {
            return "아이디 또는 비밀번호가 일치하지 않습니다.";
        }
    }

    @GetMapping("/current-user")
    public UserDetails getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return (UserDetails) authentication.getPrincipal();
        }
        return null;
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

}
