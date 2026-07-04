package com.example.demo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DebugController {

    private final JdbcTemplate jdbcTemplate;

    @GetMapping("/db-status")
    public ResponseEntity<Map<String, String>> dbStatus() {
        try {
            jdbcTemplate.execute("SELECT 1");
            return ResponseEntity.ok(Map.of("status", "connected"));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("status", "disconnected", "error", e.getMessage()));
        }
    }
}