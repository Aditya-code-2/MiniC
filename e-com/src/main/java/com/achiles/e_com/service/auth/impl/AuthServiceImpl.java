package com.achiles.e_com.service.auth.impl;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import com.achiles.e_com.dto.auth.*;
import com.achiles.e_com.entity.User;
import com.achiles.e_com.repository.UserRepository;
import com.achiles.e_com.service.auth.AuthService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    // --- Admin Traditional Registration ---
    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User.Role role = request.getRole() != null ? request.getRole() : User.Role.ROLE_CUSTOMER;

        if (role == User.Role.ROLE_ADMIN && (request.getPassword() == null || request.getPassword().isBlank())) {
            throw new RuntimeException("Error: Password is required for Admin accounts!");
        }

        String nameInput = request.getName() != null ? request.getName().trim() : "";
        String firstName = nameInput;
        String lastName = "N/A";

        if (nameInput.contains(" ")) {
            String[] parts = nameInput.split(" ", 2);
            firstName = parts[0];
            lastName = parts[1];
        }

        User user = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(request.getEmail())
                .password(request.getPassword() != null && !request.getPassword().isBlank() ? passwordEncoder.encode(request.getPassword()) : null)
                .role(role)
                .build();

        User savedUser = userRepository.save(user);

        return AuthResponse.builder()
                .userId(savedUser.getId())
                .name(savedUser.getFirstName() + " " + savedUser.getLastName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .message("User registered successfully!")
                .build();
    }

    // --- Admin Password Login ---
    @Override
    public AuthResponse login(LoginRequest request) {
        if (request.getEmail().equals(adminEmail)) {
            if (!request.getPassword().equals(adminPassword)) {
                throw new RuntimeException("Invalid Admin credentials!");
            }
            return AuthResponse.builder()
                    .userId(0L) // Or fetch if exists in DB
                    .name("Admin")
                    .email(adminEmail)
                    .role(User.Role.ROLE_ADMIN.name())
                    .message("Admin logged in successfully!")
                    .build();
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid credentials!");
            }
        } else {
            throw new RuntimeException("This account uses OTP / OAuth login. Password login not permitted!");
        }

        return AuthResponse.builder()
                .userId(user.getId())
                .name(user.getFirstName() + " " + user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("User logged in successfully!")
                .build();
    }

    // --- Customer: Send Email OTP ---
    @Override
    public String sendEmailOtp(SendEmailOtpRequest request) {
        // 1. Generate 6-digit random OTP
        String otp = String.valueOf((int) ((Math.random() * (900000)) + 100000));

      
        return "OTP sent successfully to " + request.getEmail();
    }

    // --- Customer: Verify Email OTP & Login/Register ---
    @Override
    public AuthResponse verifyEmailOtp(VerifyEmailOtpRequest request) {
       

        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            user = User.builder()
                    .firstName("User")
                    .lastName("Account")
                    .email(request.getEmail())
                    .role(User.Role.ROLE_CUSTOMER) // Default role
                    .build();
            user = userRepository.save(user);
        }

        return AuthResponse.builder()
                .userId(user.getId())
                .name(user.getFirstName() + " " + user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("OTP Verified successfully!")
                .build();
    }

    // --- Customer: Google OAuth Login ---
    @Override
    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
           
            if (user.getGoogleId() == null) {
                user.setGoogleId(request.getGoogleId());
                if (request.getProfilePic() != null) {
                    user.setProfilePic(request.getProfilePic());
                }
                userRepository.save(user);
            }
        } else {
            // Dynamic Role Selection (Customer)
            User.Role assignedRole = User.Role.ROLE_CUSTOMER;

            // Dynamic Name Split Logic
            String nameInput = request.getName() != null ? request.getName().trim() : "Google User";
            String firstName = nameInput;
            String lastName = "N/A";

            if (nameInput.contains(" ")) {
                String[] parts = nameInput.split(" ", 2);
                firstName = parts[0];
                lastName = parts[1];
            }

            user = User.builder()
                    .firstName(firstName)
                    .lastName(lastName)
                    .email(request.getEmail())
                    .googleId(request.getGoogleId())
                    .profilePic(request.getProfilePic())
                    .role(assignedRole)
                    .build();

            user = userRepository.save(user);
        }

        return AuthResponse.builder()
                .userId(user.getId())
                .name(user.getFirstName() + " " + user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("Google login successful!")
                .build();
    }
}