package com.achiles.e_com.controller.auth;

import com.achiles.e_com.dto.auth.AuthResponse;
import com.achiles.e_com.dto.auth.LoginRequest;
import com.achiles.e_com.dto.auth.RegisterRequest;
import com.achiles.e_com.service.auth.AuthService;
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
}