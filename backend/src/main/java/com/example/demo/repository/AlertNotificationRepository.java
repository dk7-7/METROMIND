package com.example.demo.repository;

import com.example.demo.entity.AlertNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertNotificationRepository extends JpaRepository<AlertNotification, Long> {

    List<AlertNotification> findByCityUserUserId(Long userId);

    List<AlertNotification> findByIsRead(Boolean isRead);

}