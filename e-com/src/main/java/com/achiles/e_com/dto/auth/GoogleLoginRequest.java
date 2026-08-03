package com.achiles.e_com.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoogleLoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Google ID is required")
    private String googleId;

    private String name;

    private String profilePic;

    private String role; // "ROLE_CUSTOMER" "ROLE_SELLER"
}