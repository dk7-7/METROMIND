package com.example.demo.controller;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:5173"
})
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(
            @Valid @RequestBody AuthRequestDto dto) {

        AuthResponseDto response = authService.login(dto);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(
            @Valid @RequestBody RegisterDto dto) {

        AuthResponseDto response = authService.register(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}