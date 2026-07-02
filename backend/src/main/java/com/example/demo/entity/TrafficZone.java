package com.example.demo.entity;


import com.example.demo.enums.CongestionLevel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "traffic_zones")
public class TrafficZone {
    @Id
    private long zoneId;
    @Column(unique = true  , nullable = false)
    private String zoneCode;
    @Column(nullable = false)
    private String zonename;

    private CongestionLevel currentCongestionLevel;
    private String district;
    private int signalCycleSeconds;
}
