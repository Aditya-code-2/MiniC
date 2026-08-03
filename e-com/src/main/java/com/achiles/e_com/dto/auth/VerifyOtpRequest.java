package com.achiles.e_com.dto.auth;
import lombok.*;
import jakarta.validation.constraints.*;
import jakarta.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifyOtpRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "OTP is required")
    @Size(min = 6, max =6, message = "OTP must be 6 digits")
    @Pattern(regexp = "^[0-9]{6}", message = "OTP must contains numeric digits only ")
    private String otp;
    
}
