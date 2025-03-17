package com.apple.shop.member;

import com.apple.shop.member.jwt.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MemberController {

    private final MemberService memberService;
    private final JWTUtil jwtUtil;

    @PostMapping("/sign-up")
    public ResponseEntity<String> join(@RequestBody MemberDTO memberDTO) {
        try {
            memberService.registerMember(memberDTO); // MemberService에서 회원 가입 로직 처리
            return ResponseEntity.ok("회원가입 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 실패");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody MemberDTO memberDTO) {
        try {
            String token = memberService.login(memberDTO);
            if (token != null) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "로그인 성공");
                response.put("token", token);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인 실패"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "로그인 실패"));
        }
    }

    @GetMapping("/mypage")
    public ResponseEntity<MemberDTO> getMyInfo(HttpServletRequest request) {
        try {
            String authorization = request.getHeader("Authorization");
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            String token = authorization.substring(7);
            String id = jwtUtil.getId(token);
            MemberDTO memberDTO = memberService.getMemberById(id);
            return ResponseEntity.ok(memberDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
