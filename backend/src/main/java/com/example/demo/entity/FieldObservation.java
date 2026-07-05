package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "field_observations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldObservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long observationId;

    @ManyToOne
    @JoinColumn(name = "incident_id")
    private TrafficIncident incident;

    @ManyToOne
    @JoinColumn(name = "outage_id")
    private UtilityOutage outage;

    @ManyToOne
    @JoinColumn(name = "technician_id", nullable = false)
    private CityUser technician;

    @Column(nullable = false, length = 1000)
    private String observationText;

    private Double sensorReadingValue;

    private String unit;

    private LocalDateTime observedAt;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @PrePersist
    protected void onCreate() {
        this.observedAt = LocalDateTime.now();
    }
}