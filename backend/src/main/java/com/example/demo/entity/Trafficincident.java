package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.example.demo.enums.IncidentStatus;
import com.example.demo.enums.IncidentType;
import com.example.demo.enums.Severity;

@Entity
@Table(name = "traffic_incidents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrafficIncident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long incidentId;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    private IncidentType incidentType;

    @Enumerated(EnumType.STRING)
    private Severity severity;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private IncidentStatus status = IncidentStatus.REPORTED;

    @ManyToOne
    @JoinColumn(name = "zone_id", nullable = false)
    private TrafficZone zone;

    private LocalDateTime reportedAt;

    private LocalDateTime resolvedAt;

    @ManyToOne
    @JoinColumn(name = "reported_by_user_id")
    private CityUser reportedBy;

    private String description;

    @PrePersist
    protected void onCreate() {
        this.reportedAt = LocalDateTime.now();
    }
}