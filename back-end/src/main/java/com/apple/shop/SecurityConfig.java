package com.apple.shop;

import com.apple.shop.member.CustomUserDetailsService;
import com.apple.shop.member.jwt.JWTFilter;
import com.apple.shop.member.jwt.JWTUtil;
import com.apple.shop.member.jwt.LoginFilter;
import com.apple.shop.storeMember.StoreMemberLoginFilter;
import com.apple.shop.storeMember.StoreMemberUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
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

    private final JWTUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;
    private final StoreMemberUserDetailsService storeMemberUserDetailsService;

    // 공개 API 경로 (인증 불필요)
    // Plan-31: 로그인 경로를 /api/login으로 통일하여 프록시 설정과 일치시킴
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
            "/api/memberinfo", "/api/mypage"
    };

    // 사업자 전용 API 경로
    private static final String[] BUSINESS_URLS = {
            "/api/business/**"
    };

    /**
     * 일반 사용자(Member) 인증용 AuthenticationManager
     */
    @Bean
    public AuthenticationManager memberAuthenticationManager() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(bCryptPasswordEncoder());
        return new ProviderManager(provider);
    }

    /**
     * 사업자(StoreMember) 인증용 AuthenticationManager
     */
    @Bean
    public AuthenticationManager storeMemberAuthenticationManager() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(storeMemberUserDetailsService);
        provider.setPasswordEncoder(bCryptPasswordEncoder());
        return new ProviderManager(provider);
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
        // 일반 사용자 로그인 필터 (/api/login) - Plan-31: 프록시 설정과 통일
        LoginFilter memberLoginFilter = new LoginFilter(memberAuthenticationManager(), jwtUtil);
        memberLoginFilter.setFilterProcessesUrl("/api/login");

        // 사업자 로그인 필터 (/api/business/login)
        StoreMemberLoginFilter storeMemberLoginFilter = new StoreMemberLoginFilter(
                storeMemberAuthenticationManager(), jwtUtil);
        storeMemberLoginFilter.setFilterProcessesUrl("/api/business/login");

        // JWT 검증 필터
        http.addFilterBefore(new JWTFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);
        // 일반 사용자 로그인 필터
        http.addFilterAt(memberLoginFilter, UsernamePasswordAuthenticationFilter.class);
        // 사업자 로그인 필터 (일반 로그인 필터 뒤에 추가)
        http.addFilterAfter(storeMemberLoginFilter, UsernamePasswordAuthenticationFilter.class);
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
                        .exposedHeaders("Authorization")
                        .allowCredentials(true);
            }
        };
    }
}