package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "traffic_zones")
public class TrafficZone {
    @Id
    private long zoneId;
    
    private String zoneCode;
}
