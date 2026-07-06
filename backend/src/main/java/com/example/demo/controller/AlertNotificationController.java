package com.example.demo.controller;

import com.example.demo.entity.AlertNotification;
import com.example.demo.repository.AlertNotificationRepository;
import com.example.demo.service.AlertNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor 
public class AlertNotificationController {

    private final AlertNotificationService alertNotificationService;
    private final AlertNotificationRepository repository;

    @GetMapping
    public ResponseEntity<List<AlertNotification>> getAll(Authentication auth) {
        if (alertNotificationService != null) {
            return ResponseEntity.ok(alertNotificationService.getAlertsForUser(auth.getName()));
        }
        return ResponseEntity.ok(repository.findAll());
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable Long id, @RequestBody(required = false) Object dummy) {
        if (alertNotificationService != null) {
            alertNotificationService.markAsRead(id);
        } else {
            AlertNotification alert = repository.findById(id)
                    .orElseThrow(() -> new com.example.demo.exception.ResourceNotFoundException("Alert not found"));
            alert.setRead(true);
            repository.save(alert);
        }
        return ResponseEntity.ok(Map.of("message", "Alert marked as read"));
    }
}