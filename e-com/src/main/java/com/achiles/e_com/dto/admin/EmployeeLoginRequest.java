package com.achiles.e_com.dto.admin;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Email;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeLoginRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
    
}
