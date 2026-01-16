package com.apple.shop;

import com.apple.shop.member.jwt.JWTFilter;
import com.apple.shop.member.jwt.JWTUtil;
import com.apple.shop.member.jwt.LoginFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;

    // 공개 API 경로 (인증 불필요)
    private static final String[] PUBLIC_URLS = {
            "/api/login", "/api/sign-up",
            "/api/business/login", "/api/business/sign-up",
            "/api/store-list/**", "/api/shop/**", "/api/store-info",
            "/api/review", "/api/main/**"
    };

    // 고객 전용 API 경로
    private static final String[] USER_URLS = {
            "/api/address/**", "/api/address-add", "/api/address-update", "/api/address-delete/**",
            "/api/order/**", "/api/cart/**", "/api/pay/**",
            "/api/memberinfo"
    };

    // 사업자 전용 API 경로
    private static final String[] BUSINESS_URLS = {
            "/api/business/**"
    };

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        configureBasicSecurity(http);
        configureAuthorization(http);
        configureFilters(http);
        configureSessionManagement(http);
        return http.build();
    }

    /**
     * CSRF, 폼 로그인, HTTP Basic 인증을 비활성화합니다.
     */
    private void configureBasicSecurity(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable());
        http.formLogin(form -> form.disable());
        http.httpBasic(basic -> basic.disable());
    }

    /**
     * URL 기반 인가 규칙을 설정합니다.
     * ADR-001: 역할 기반 접근 제어 (RBAC) 적용
     */
    private void configureAuthorization(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                // 공개 API - 인증 불필요
                .requestMatchers(PUBLIC_URLS).permitAll()
                // 고객 전용 API - USER 역할 필요
                .requestMatchers(USER_URLS).hasAnyRole("USER", "ADMIN")
                // 사업자 전용 API - BUSINESS 역할 필요
                .requestMatchers(BUSINESS_URLS).hasAnyRole("BUSINESS", "ADMIN")
                // 그 외 모든 요청은 인증 필요
                .anyRequest().authenticated());
    }

    /**
     * JWT 필터와 로그인 필터를 등록합니다.
     */
    private void configureFilters(HttpSecurity http) throws Exception {
        http.addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);
        http.addFilterAt(
                new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil),
                UsernamePasswordAuthenticationFilter.class);
    }

    /**
     * 세션 정책을 STATELESS로 설정합니다.
     */
    private void configureSessionManagement(HttpSecurity http) throws Exception {
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}