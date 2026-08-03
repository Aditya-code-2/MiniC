package com.achiles.e_com.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendOtpRequest {
    @NotBlank(message = "Target (Email/Phone) is required")
    private String target; 
    private String role; 
}