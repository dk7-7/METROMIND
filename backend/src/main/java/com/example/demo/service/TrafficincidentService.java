package com.example.demo.service;

import com.example.demo.dto.IncidentDto;
import com.example.demo.entity.*;
import com.example.demo.enums.*;
import com.example.demo.exception.IllegalStateException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.AlertNotificationRepository;
import com.example.demo.repository.CityUserRepository;
import com.example.demo.repository.TrafficincidentRepository;
import com.example.demo.repository.TrafficZoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class TrafficincidentService {

    private final TrafficincidentRepository trafficincidentRepository;
    private final TrafficZoneRepository trafficZoneRepository;
    private final CityUserRepository cityUserRepository;
    private final AlertNotificationRepository alertNotificationRepository;

    public Trafficincident reportIncident(IncidentDto dto, String username) {
        TrafficZone zone = trafficZoneRepository.findById(dto.getZoneId())
                .orElseThrow(() -> new ResourceNotFoundException("TrafficZone not found"));

        CityUser reportedBy = cityUserRepository.findByUsername(username).orElse(null);

        Severity severity = dto.getSeverity() != null ? Severity.valueOf(dto.getSeverity()) : Severity.LOW;

        Trafficincident incident = Trafficincident.builder()
                .title(dto.getTitle())
                .incidentType(dto.getIncidentType() != null ? IncidentType.valueOf(dto.getIncidentType()) : null)
                .severity(severity)
                .status(IncidentStatus.REPORTED)
                .zone(zone)
                .reportedBy(reportedBy)
                .description(dto.getDescription())
                .build();

        Trafficincident saved = trafficincidentRepository.save(incident);

        if (severity == Severity.HIGH || severity == Severity.CRITICAL) {
            AlertNotification alert = AlertNotification.builder()
                    .targetRole(Role.TRAFFIC_CONTROLLER)
                    .message("Traffic incident reported: " + saved.getTitle())
                    .relatedEntityType("INCIDENT")
                    .relatedEntityId(saved.getIncidentId())
                    .severity(severity)
                    .isRead(false)
                    .build();
            alertNotificationRepository.save(alert);
        }

        return saved;
    }

    public Trafficincident dispatchResponse(Long id) {
        Trafficincident incident = trafficincidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"));

        if (incident.getStatus() != IncidentStatus.REPORTED) {
            throw new IllegalStateException("Incident must be in REPORTED state to dispatch");
        }
        incident.setStatus(IncidentStatus.DISPATCHED);
        return trafficincidentRepository.save(incident);
    }

    @Transactional(readOnly = true)
    public List<Trafficincident> getAllIncidents() {
        return trafficincidentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Trafficincident> getIncidentById(Long id) {
        Trafficincident incident = trafficincidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"));
        return Optional.of(incident);
    }

    public Trafficincident updateIncident(Long id, IncidentDto dto) {
        Trafficincident incident = trafficincidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"));

        if (dto.getZoneId() != null) {
            TrafficZone zone = trafficZoneRepository.findById(dto.getZoneId())
                    .orElseThrow(() -> new ResourceNotFoundException("TrafficZone not found"));
            incident.setZone(zone);
        }
        incident.setTitle(dto.getTitle());
        if (dto.getIncidentType() != null) incident.setIncidentType(IncidentType.valueOf(dto.getIncidentType()));
        if (dto.getSeverity() != null) incident.setSeverity(Severity.valueOf(dto.getSeverity()));
        incident.setDescription(dto.getDescription());

        return trafficincidentRepository.save(incident);
    }

    public void deleteIncident(Long id) {
        trafficincidentRepository.deleteById(id);
    }
}