package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthResponseDto {

    private String token;
    private String username;
    private String role;

    public AuthResponseDto(String token, String username, String role) {
        this.token = token;
        this.username = username;
        this.role = role;
    }
}