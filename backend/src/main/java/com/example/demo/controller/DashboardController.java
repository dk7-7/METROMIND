package com.example.demo.controller;

import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:5173"
})
public class DashboardController {

    private final AnalyticsService analyticsService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('CITY_ADMINISTRATOR')")
    public ResponseEntity<DashboardStatsDto> getStats() {
        return ResponseEntity.ok(analyticsService.getCityStats());
    }
}