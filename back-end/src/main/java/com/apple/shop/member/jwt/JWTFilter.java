package com.apple.shop.member.jwt;

import com.apple.shop.member.CustomUserDetails;
import com.apple.shop.member.Member;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JWTUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        Optional<String> token = extractToken(request);

        if (token.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            if (jwtUtil.isExpired(token.get())) {
                sendUnauthorizedResponse(response, "Token expired");
                return;
            }
            setAuthenticationContext(token.get());
            filterChain.doFilter(request, response);
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            sendUnauthorizedResponse(response, "Token expired");
        } catch (io.jsonwebtoken.JwtException e) {
            sendUnauthorizedResponse(response, "Invalid token");
        }
    }

    /**
     * 401 Unauthorized 응답을 전송합니다.
     */
    private void sendUnauthorizedResponse(HttpServletResponse response, String message)
            throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }

    /**
     * Authorization 헤더에서 Bearer 토큰을 추출합니다.
     */
    private Optional<String> extractToken(HttpServletRequest request) {
        String authorization = request.getHeader(AUTHORIZATION_HEADER);

        if (authorization == null || !authorization.startsWith(BEARER_PREFIX)) {
            return Optional.empty();
        }

        return Optional.of(authorization.substring(BEARER_PREFIX.length()));
    }

    /**
     * 토큰 정보를 기반으로 SecurityContext에 인증 정보를 설정합니다.
     */
    private void setAuthenticationContext(String token) {
        Member member = createMemberFromToken(token);
        CustomUserDetails userDetails = new CustomUserDetails(member);
        Authentication authToken = createAuthenticationToken(userDetails);
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }

    /**
     * 토큰에서 Member 객체를 생성합니다.
     */
    private Member createMemberFromToken(String token) {
        Member member = new Member();
        member.setId(jwtUtil.getId(token));
        member.setPw("temppassword");
        member.setRole(jwtUtil.getRole(token));
        return member;
    }

    /**
     * Spring Security 인증 토큰을 생성합니다.
     */
    private Authentication createAuthenticationToken(CustomUserDetails userDetails) {
        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities());
    }
}
