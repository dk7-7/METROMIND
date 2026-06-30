package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "alert_notificaations")
public class AlertNotification {
    @Id
    private long alertId;
    
}
