package com.achiles.e_com.dto.auth;

import com.achiles.e_com.entity.User.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private String profilePic;
}
