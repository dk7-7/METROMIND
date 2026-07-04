package com.example.demo.service;

import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.entity.IncidentStatus;
import com.example.demo.entity.OutageStatus;
import com.example.demo.entity.Severity;
import com.example.demo.repository.AlertNotificationRepository;
import com.example.demo.repository.TrafficIncidentRepository;
import com.example.demo.repository.TrafficZoneRepository;
import com.example.demo.repository.UtilityOutageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final TrafficIncidentRepository trafficIncidentRepository;
    private final TrafficZoneRepository trafficZoneRepository;
    private final UtilityOutageRepository utilityOutageRepository;
    private final AlertNotificationRepository alertNotificationRepository;

    public DashboardStatsDto getCityStats() {
        long totalIncidents = trafficIncidentRepository.countByStatusNotIn(
                List.of(IncidentStatus.CLOSED));
        long activeOutages = utilityOutageRepository.findByStatus(OutageStatus.ACTIVE).size();
        long congestedZones = trafficZoneRepository.findHighlyCongestedZones().size();
        long criticalAlerts = alertNotificationRepository.findAll().stream()
                .filter(a -> a.getSeverity() == Severity.CRITICAL)
                .count();

        return new DashboardStatsDto(totalIncidents, activeOutages, congestedZones, criticalAlerts);
    }
}