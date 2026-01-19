package com.apple.shop.member.jwt;

import com.apple.shop.member.CustomUserDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Collection;

@RequiredArgsConstructor
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private static final String USERNAME_PARAM = "id";
    private static final String PASSWORD_PARAM = "pw";
    private static final long JWT_EXPIRATION_MS = 1000L * 60 * 60 * 10; // 10시간 (ms)
    private static final int UNAUTHORIZED_STATUS = 401;

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) {
        configureParameters();

        String id = obtainUsername(request);
        String pw = obtainPassword(request);

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(id, pw, null);

        return authenticationManager.authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String id = userDetails.getUsername();
        String role = extractRoleFromAuthorities(authentication.getAuthorities());

        String token = jwtUtil.createJwt(id, role, JWT_EXPIRATION_MS);

        // Plan-32: HttpOnly Cookie로 JWT 발급 (XSS 방지)
        Cookie jwtCookie = new Cookie("jwt", token);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false); // 로컬: false, 배포: true (환경변수로 분기 가능)
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge((int) (JWT_EXPIRATION_MS / 1000)); // 10시간
        response.addCookie(jwtCookie);

        // 기존 Header 방식도 유지 (호환성)
        response.addHeader("Authorization", "Bearer " + token);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException failed) {
        response.setStatus(UNAUTHORIZED_STATUS);
    }

    /**
     * Spring Security 파라미터명을 설정합니다.
     */
    private void configureParameters() {
        setUsernameParameter(USERNAME_PARAM);
        setPasswordParameter(PASSWORD_PARAM);
    }

    /**
     * 권한 컬렉션에서 첫 번째 역할을 추출합니다.
     */
    private String extractRoleFromAuthorities(Collection<? extends GrantedAuthority> authorities) {
        return authorities.iterator().next().getAuthority();
    }
}
