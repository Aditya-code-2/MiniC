package com.achiles.e_com.service.auth.impl;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import com.achiles.e_com.dto.auth.*;
import com.achiles.e_com.entity.*;
import com.achiles.e_com.repository.*;
import com.achiles.e_com.service.auth.AuthService;
import lombok.RequiredArgsConstructor;

import com.achiles.e_com.config.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final WishlistRepository wishlistRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final AddressRepository addressRepository;
    private final ReviewRepository reviewRepository;
    private final OtpTokenRepository otpTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${app.admin.email:adityakumar909763@gmail.com}")
    private String adminEmail;

    @Value("${app.admin.password:Admin@123SecurePass}")
    private String adminPassword;

    // --- Standard Email & Password Registration ---
    @Override
    public AuthResponse register(RegisterRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();

        Optional<User> existingUserOpt = userRepository.findByEmail(cleanEmail);
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            // If user exists without password, allow setting a password
            if (existingUser.getPassword() == null || existingUser.getPassword().isBlank()) {
                existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
                if (request.getName() != null && !request.getName().isBlank()) {
                    String nameInput = request.getName().trim();
                    if (nameInput.contains(" ")) {
                        String[] parts = nameInput.split(" ", 2);
                        existingUser.setFirstName(parts[0]);
                        existingUser.setLastName(parts[1]);
                    } else {
                        existingUser.setFirstName(nameInput);
                        existingUser.setLastName("");
                    }
                }
                User savedUser = userRepository.save(existingUser);
                String fullName = getFullName(savedUser.getFirstName(), savedUser.getLastName());
                String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId(), savedUser.getRole().name(), fullName);

                return AuthResponse.builder()
                        .token(token)
                        .userId(savedUser.getId())
                        .name(fullName)
                        .email(savedUser.getEmail())
                        .role(savedUser.getRole().name())
                        .message("Account updated and registered successfully!")
                        .build();
            } else {
                throw new RuntimeException("Error: Email is already registered! Please login.");
            }
        }

        User.Role role = request.getRole() != null ? request.getRole() : User.Role.ROLE_CUSTOMER;

        String nameInput = request.getName() != null ? request.getName().trim() : "";
        String firstName = nameInput;
        String lastName = "";

        if (nameInput.contains(" ")) {
            String[] parts = nameInput.split(" ", 2);
            firstName = parts[0];
            lastName = parts[1];
        }

        User user = User.builder()
                .firstName(firstName.isBlank() ? "User" : firstName)
                .lastName(lastName)
                .email(cleanEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        User savedUser = userRepository.save(user);
        String fullName = getFullName(savedUser.getFirstName(), savedUser.getLastName());
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId(), savedUser.getRole().name(), fullName);

        return AuthResponse.builder()
                .token(token)
                .userId(savedUser.getId())
                .name(fullName)
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .message("User registered successfully!")
                .build();
    }

    // --- Standard Email & Password Login ---
    @Override
    public AuthResponse login(LoginRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();

        // Admin check
        if (cleanEmail.equalsIgnoreCase(adminEmail.trim())) {
            if (!request.getPassword().equals(adminPassword)) {
                throw new RuntimeException("Invalid Admin credentials!");
            }
            String token = jwtUtil.generateToken(adminEmail, 0L, User.Role.ROLE_ADMIN.name(), "Admin");
            return AuthResponse.builder()
                    .token(token)
                    .userId(0L)
                    .name("Admin")
                    .email(adminEmail)
                    .role(User.Role.ROLE_ADMIN.name())
                    .message("Admin logged in successfully!")
                    .build();
        }

        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid email or password!");
            }
        } else {
            throw new RuntimeException("No password set for this account. Please register with a password!");
        }

        String fullName = getFullName(user.getFirstName(), user.getLastName());
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name(), fullName);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(fullName)
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("User logged in successfully!")
                .build();
    }

    private String getFullName(String first, String last) {
        String f = first != null ? first.trim() : "";
        String l = last != null ? last.trim() : "";
        String combined = (f + " " + l).trim();
        return combined.isEmpty() ? "User" : combined;
    }

    // --- Delete all previous customer / test login data ---
    @Override
    @Transactional
    public String clearPreviousUserData() {
        List<User> usersToDelete = userRepository.findAll().stream()
                .filter(u -> !u.getEmail().equalsIgnoreCase(adminEmail))
                .collect(Collectors.toList());

        int count = usersToDelete.size();
        for (User u : usersToDelete) {
            Long uid = u.getId();

            // 1. Delete associated cart
            try {
                cartRepository.findByUserId(uid).ifPresent(cartRepository::delete);
            } catch (Exception ignored) {}

            // 2. Delete associated wishlist
            try {
                wishlistRepository.findByUserId(uid).ifPresent(wishlistRepository::delete);
            } catch (Exception ignored) {}

            // 3. Delete addresses
            try {
                List<Address> addresses = addressRepository.findByUserId(uid);
                if (addresses != null && !addresses.isEmpty()) {
                    addressRepository.deleteAll(addresses);
                }
            } catch (Exception ignored) {}

            // 4. Delete payments & orders
            try {
                List<Order> orders = orderRepository.findByUserId(uid);
                if (orders != null && !orders.isEmpty()) {
                    for (Order o : orders) {
                        try {
                            paymentRepository.findByOrderId(o.getId()).ifPresent(paymentRepository::delete);
                        } catch (Exception ignored) {}
                    }
                    orderRepository.deleteAll(orders);
                }
            } catch (Exception ignored) {}

            // 5. Delete reviews
            try {
                List<Review> reviews = reviewRepository.findAll().stream()
                        .filter(r -> r.getUser() != null && r.getUser().getId().equals(uid))
                        .collect(Collectors.toList());
                if (!reviews.isEmpty()) {
                    reviewRepository.deleteAll(reviews);
                }
            } catch (Exception ignored) {}

            // 6. Delete user
            userRepository.delete(u);
        }

        // 7. Delete OTP tokens
        try {
            otpTokenRepository.deleteAll();
        } catch (Exception ignored) {}

        return "Successfully deleted " + count + " previous user login records and their data.";
    }

    // --- Legacy Email OTP stubs ---
    @Override
    public String sendEmailOtp(SendEmailOtpRequest request) {
        return "OTP service is deprecated. Please use Email and Password login.";
    }

    @Override
    public AuthResponse verifyEmailOtp(VerifyEmailOtpRequest request) {
        throw new UnsupportedOperationException("OTP login is deprecated. Please use Email and Password login.");
    }

    // --- Legacy Google Login stub ---
    @Override
    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        throw new UnsupportedOperationException("Google Login is disabled. Please use Email and Password login.");
    }

    // Admin - Get all users
    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(user -> UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .profilePic(user.getProfilePic())
                .build()).collect(Collectors.toList());
    }
}