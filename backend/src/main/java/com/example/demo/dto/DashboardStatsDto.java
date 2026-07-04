package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {

    private long totalIncidents;

    private long activeIncidents;

    private long resolvedIncidents;

    private long totalOutages;

    private long activeOutages;

    private long totalZones;

    private long totalGrids;

    private long pendingAlerts;
}