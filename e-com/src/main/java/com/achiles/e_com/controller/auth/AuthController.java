package com.achiles.e_com.controller.auth;

import com.achiles.e_com.dto.auth.AuthResponse;
import com.achiles.e_com.dto.auth.LoginRequest;
import com.achiles.e_com.dto.auth.RegisterRequest;
import com.achiles.e_com.dto.auth.UserResponse;
import com.achiles.e_com.service.auth.AuthService;
import com.achiles.e_com.config.OAuth2CodeService;
import com.achiles.e_com.config.JwtUtil;
import com.achiles.e_com.entity.User;
import com.achiles.e_com.repository.UserRepository;
import java.util.List;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OAuth2CodeService oauth2CodeService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    /**
     * Customer Self-Registration
     * 
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return new ResponseEntity<>(authService.register(request), HttpStatus.CREATED);
    }

    /**
     * Common Login API for Everyone (Customer, Employee, Admin)
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * Send OTP to Email
     */
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@Valid @RequestBody com.achiles.e_com.dto.auth.SendEmailOtpRequest request) {
        return ResponseEntity.ok(authService.sendEmailOtp(request));
    }

    /**
     * Verify OTP
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody com.achiles.e_com.dto.auth.VerifyEmailOtpRequest request) {
        return ResponseEntity.ok(authService.verifyEmailOtp(request));
    }

    /**
     * Admin: Get all users
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    /**
     * Exchange one-time OAuth2 code for JWT token
     */
    @GetMapping("/exchange-code")
    public ResponseEntity<AuthResponse> exchangeCode(@RequestParam String code) {
        String token = oauth2CodeService.exchangeCode(code);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Extract email to get user details
        String email = jwtUtil.extractUsername(token);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getFirstName() + " " + user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("OAuth2 token exchanged successfully!")
                .build());
    }
}