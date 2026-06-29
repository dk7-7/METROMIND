package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.AlertNotification;

public interface AlertNotificationRepository extends JpaRepository<AlertNotification,Long>{
    
}