package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.example.demo.enums.CongestionLevel;

@Entity
@Table(name = "traffic_zones")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrafficZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long zoneId;

    @Column(name = "zone_name", nullable = false)
    private String zoneName;

    @Column(name = "zone_code", unique = true, nullable = false)
    private String zoneCode;

    @Column(nullable = false)
    private String district;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CongestionLevel currentCongestionLevel;

    @Column(nullable = false)
    private Integer signalCycleSeconds;

    private LocalDateTime lastUpdated;

    @PrePersist
    protected void onCreate() {
        this.lastUpdated = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}