package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "city_users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CityUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private String fullName;

    private String district;

    @Column(unique = true)
    private String badgeNumber;

    @Builder.Default
    private Boolean isActive = true;
}