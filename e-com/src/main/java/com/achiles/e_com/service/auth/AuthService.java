package com.achiles.e_com.service.auth;

import com.achiles.e_com.dto.auth.*;

public interface AuthService {

    // Admin & Employee Passcode Auth
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);

    // Customer & Seller - Email OTP Auth
    String sendEmailOtp(SendEmailOtpRequest request);
    AuthResponse verifyEmailOtp(VerifyEmailOtpRequest request);

    // Customer & Seller - Google OAuth Auth
    AuthResponse loginWithGoogle(GoogleLoginRequest request);
}