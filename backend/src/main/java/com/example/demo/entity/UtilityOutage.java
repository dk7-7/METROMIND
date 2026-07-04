package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.example.demo.enums.OutageStatus;
import com.example.demo.enums.OutageType;
import com.example.demo.enums.Severity;

@Entity
@Table(name = "utility_outages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UtilityOutage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long outageId;

    @ManyToOne
    @JoinColumn(name = "grid_id", nullable = false)
    private UtilityGrid grid;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OutageType outageType;

    @Column(nullable = false)
    private String affectedArea;

    private LocalDateTime startTime;

    private LocalDateTime estimatedRestorationTime;

    private LocalDateTime actualRestorationTime;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OutageStatus status = OutageStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    private Severity severity;

    @ManyToOne
    @JoinColumn(name = "registered_by_user_id")
    private CityUser registeredBy;

    @PrePersist
    protected void onCreate() {
        this.startTime = LocalDateTime.now();
    }
}   