package com.example.demo.service;

import com.example.demo.config.JwtService;
import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.CityUser;
import com.example.demo.entity.Role;
import com.example.demo.repository.CityUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final CityUserRepository cityUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponseDto register(RegisterDto dto) {
        if (cityUserRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new com.example.demo.exception.BusinessValidationException("Username already exists");
        }

        Role parsedRole;
        try {
            parsedRole = Role.valueOf(dto.getRole());
        } catch (IllegalArgumentException e) {
            throw new com.example.demo.exception.BusinessValidationException("Invalid role");
        }

        String district = (dto.getDistrict() != null && !dto.getDistrict().trim().isEmpty())
                ? dto.getDistrict().trim() : null;
        String badgeNumber = (dto.getBadgeNumber() != null && !dto.getBadgeNumber().trim().isEmpty())
                ? dto.getBadgeNumber().trim() : null;

        CityUser user = CityUser.builder()
                .username(dto.getUsername())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .fullName(dto.getFullName())
                .role(parsedRole)
                .district(district)
                .badgeNumber(badgeNumber)
                .isActive(true)
                .build();
        cityUserRepository.save(user);

        String token = jwtService.generateToken(
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getUsername())
                        .password(user.getPasswordHash())
                        .authorities("ROLE_" + user.getRole().name())
                        .build()
        );
        return new AuthResponseDto(token, user.getUsername(), user.getRole().name());
    }

    public AuthResponseDto login(AuthRequestDto dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
        );
        CityUser user = cityUserRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new com.example.demo.exception.ResourceNotFoundException("User not found"));

        String token = jwtService.generateToken(
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getUsername())
                        .password(user.getPasswordHash())
                        .authorities("ROLE_" + user.getRole().name())
                        .build()
        );
        return new AuthResponseDto(token, user.getUsername(), user.getRole().name());
    }
}