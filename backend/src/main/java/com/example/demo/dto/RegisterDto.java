package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDto {

@NotBlank
private String username;

@NotBlank
private String password;

@NotBlank
private String fullName;

@NotBlank
private String role;

private String district;

private String badgeNumber;
}