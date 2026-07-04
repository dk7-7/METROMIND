package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.example.demo.enums.GridType;

@Entity
@Table(name = "utility_grids")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UtilityGrid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gridId;

    @Column(name = "grid_name", nullable = false)
    private String gridName;

    @Enumerated(EnumType.STRING)
    private GridType gridType;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private Double capacityUnits;

    @Builder.Default
    private Double currentLoad = 0.0;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private GridStatus status = GridStatus.OPERATIONAL;

    private LocalDateTime lastInspectedAt;
}