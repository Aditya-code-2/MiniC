package com.achiles.e_com.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 1. Missing PasswordEncoder Bean (Fixes DataInitializer error)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter, com.achiles.e_com.repository.UserRepository userRepository, JwtUtil jwtUtil, OAuth2CodeService oauth2CodeService) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/login/**", "/oauth2/**", "/api/v1/products/**", "/api/v1/categories/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oauthSuccessHandler(userRepository, jwtUtil, oauth2CodeService))
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Custom OAuth Success Handler Bean
    @Bean
    public AuthenticationSuccessHandler oauthSuccessHandler(com.achiles.e_com.repository.UserRepository userRepository, JwtUtil jwtUtil, OAuth2CodeService oauth2CodeService) {
        return (request, response, authentication) -> {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String email = oAuth2User.getAttribute("email");
            String rawName = oAuth2User.getAttribute("name");
            String name = (rawName != null && !rawName.trim().isEmpty()) ? rawName : "User";
            String googleId = oAuth2User.getAttribute("sub");
            String profilePic = oAuth2User.getAttribute("picture");

            com.achiles.e_com.entity.User user = userRepository.findByEmail(email).orElseGet(() -> {
                com.achiles.e_com.entity.User newUser = com.achiles.e_com.entity.User.builder()
                        .email(email)
                        .firstName(name)
                        .lastName("")
                        .googleId(googleId)
                        .profilePic(profilePic)
                        .role(com.achiles.e_com.entity.User.Role.ROLE_CUSTOMER)
                        .build();
                return userRepository.save(newUser);
            });

            // Generate JWT Token
            String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name(), user.getFirstName() + " " + user.getLastName());
            
            // Generate one-time code
            String code = oauth2CodeService.generateCode(token, user);

            // Redirect to React Frontend with ONLY the single-use code
            String redirectUrl = "http://localhost:3001/oauth-success?code=" + code;
            response.sendRedirect(redirectUrl);
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:3001"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}