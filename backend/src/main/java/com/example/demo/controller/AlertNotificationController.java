package com.example.demo.controller;

import com.example.demo.entity.AlertNotification;
import com.example.demo.service.AlertNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AlertNotificationController {

    private final AlertNotificationService alertNotificationService;

    @GetMapping
    public ResponseEntity<List<AlertNotification>> getAll(Authentication auth) {
        return ResponseEntity.ok(alertNotificationService.getAlertsForUser(auth.getName()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<String> markAsRead(@PathVariable Long id) {
        alertNotificationService.markAsRead(id);
        return ResponseEntity.ok("Alert marked as read");
    }
}