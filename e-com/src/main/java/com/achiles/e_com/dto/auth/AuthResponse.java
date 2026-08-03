package com.achiles.e_com.dto.auth;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
     private String token;
    private String message;
    @Builder.Default
    private String type = "Bearer";

    private Long userId;
    private String name;
    private String email;
    private String role;
    private String department;

   
    
}