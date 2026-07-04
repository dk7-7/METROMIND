package com.example.demo.repository;

import com.example.demo.entity.AlertNotification;
import com.example.demo.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertNotificationRepository extends JpaRepository<AlertNotification, Long> {
List<AlertNotification> findByTargetRole(Role role);
List<AlertNotification> findByTargetRoleAndIsReadFalse(Role role);
}