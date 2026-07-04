package com.example.demo.service;

import com.example.demo.entity.AlertNotification;
import com.example.demo.entity.CityUser;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.AlertNotificationRepository;
import com.example.demo.repository.CityUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AlertNotificationService {

    private final AlertNotificationRepository alertNotificationRepository;
    private final CityUserRepository cityUserRepository;

    @Transactional(readOnly = true)
    public List<AlertNotification> getAlertsForUser(String username) {
        CityUser user = cityUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return alertNotificationRepository.findByTargetRole(user.getRole());
    }

    public AlertNotification markAsRead(Long id) {
        AlertNotification alert = alertNotificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found"));
        alert.setRead(true);
        return alertNotificationRepository.save(alert);
    }
}