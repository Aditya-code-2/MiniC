package com.achiles.e_com.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    // --- Added these 2 fields for OAuth ---
    @Column(name = "google_id", unique = true)
    private String googleId;

    @Column(name = "profile_pic")
    private String profilePic;
    // ----------------------------

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    public enum Role {
        ROLE_CUSTOMER,
        ROLE_ADMIN,
        ROLE_SELLER,
        ROLE_EMPLOYEE
    }

    // Employee Details:

@Column(name = "phone_number", unique = true)
private String phoneNumber;

@Enumerated(EnumType.STRING)
private Department department;

public enum Department {
    LOGISTICS,
    SUPPORT,
    CATALOG,
    FINANCE
}
}