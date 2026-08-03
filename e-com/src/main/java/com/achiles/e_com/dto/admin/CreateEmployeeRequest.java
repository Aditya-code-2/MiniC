package com.achiles.e_com.dto.admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateEmployeeRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;
    
    @NotBlank(message = "Temporary password is required")
    private String temporaryPassword;

    @NotNull(message = "Department is required")
    private Department department; // LOGISTICS, SUPPORT, CATALOG, FINANCE

    public enum Department {
        LOGISTICS,
        SUPPORT,
        CATALOG,
        FINANCE
    }

    
}
