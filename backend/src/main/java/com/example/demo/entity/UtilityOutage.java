package com.example.demo.entity;

import com.example.demo.enums.OutageStatus;
import com.example.demo.enums.OutageType;
import com.example.demo.enums.Severity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "utility_outages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UtilityOutage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long outageId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OutageType outageType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OutageStatus status = OutageStatus.ACTIVE;

    @Column(nullable = false)
    private String affectedArea;

    @Column(length = 1000)
    private String description;

    @Builder.Default
    private LocalDateTime reportedAt = LocalDateTime.now();

    private LocalDateTime restoredAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grid_id", nullable = false)
    private UtilityGrid utilityGrid;
}