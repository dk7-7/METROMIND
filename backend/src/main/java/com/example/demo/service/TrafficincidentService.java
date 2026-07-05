package com.example.demo.service;

import com.example.demo.dto.IncidentDto;
import com.example.demo.entity.*;
import com.example.demo.enums.*;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.IllegalStateException;
import com.example.demo.repository.AlertNotificationRepository;
import com.example.demo.repository.CityUserRepository;
import com.example.demo.repository.TrafficincidentRepository;
import com.example.demo.repository.TrafficZoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class TrafficincidentService {

    private final TrafficincidentRepository trafficIncidentRepository;
    private final TrafficZoneRepository trafficZoneRepository;
    private final CityUserRepository cityUserRepository;
    private final AlertNotificationRepository alertNotificationRepository;

    public Trafficincident reportIncident(IncidentDto dto, String username) {
        TrafficZone zone = trafficZoneRepository.findById(dto.getZoneId())
                .orElseThrow(() -> new ResourceNotFoundException("TrafficZone not found"));

        CityUser reportedBy = cityUserRepository.findByUsername(username).orElse(null);

        Severity severity = Severity.LOW;
        if (dto.getSeverity() != null) {
            try {
                severity = Severity.valueOf(dto.getSeverity());
            } catch (IllegalArgumentException e) {
                throw new com.example.demo.exception.BusinessValidationException("Invalid severity");
            }
        }

        IncidentType type = null;
        if (dto.getIncidentType() != null) {
            try {
                type = IncidentType.valueOf(dto.getIncidentType());
            } catch (IllegalArgumentException e) {
                throw new com.example.demo.exception.BusinessValidationException("Invalid incident type");
            }
        }

        Trafficincident incident = Trafficincident.builder()
                .title(dto.getTitle())
                .incidentType(type)
                .severity(severity)
                .status(IncidentStatus.REPORTED)
                .zone(zone)
                .reportedBy(reportedBy)
                .description(dto.getDescription())
                .build();

        Trafficincident saved = trafficIncidentRepository.save(incident);

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
        Trafficincident incident = trafficIncidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"));

        if (incident.getStatus() != IncidentStatus.REPORTED) {
            throw new IllegalStateException("Incident must be in REPORTED state to dispatch");
        }
        incident.setStatus(IncidentStatus.DISPATCHED);
        return trafficIncidentRepository.save(incident);
    }

    @Transactional(readOnly = true)
    public List<Trafficincident> getAllIncidents() {
        return trafficIncidentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Trafficincident> getIncidentById(Long id) {
        Trafficincident incident = trafficIncidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"));
        return Optional.of(incident);
    }

    public Trafficincident updateIncident(Long id, IncidentDto dto) {
        Trafficincident incident = trafficIncidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"));

        if (dto.getZoneId() != null) {
            TrafficZone zone = trafficZoneRepository.findById(dto.getZoneId())
                    .orElseThrow(() -> new ResourceNotFoundException("TrafficZone not found"));
            incident.setZone(zone);
        }
        incident.setTitle(dto.getTitle());
        if (dto.getIncidentType() != null) {
            try {
                incident.setIncidentType(IncidentType.valueOf(dto.getIncidentType()));
            } catch (IllegalArgumentException e) {
                throw new com.example.demo.exception.BusinessValidationException("Invalid incident type");
            }
        }
        if (dto.getSeverity() != null) {
            try {
                incident.setSeverity(Severity.valueOf(dto.getSeverity()));
            } catch (IllegalArgumentException e) {
                throw new com.example.demo.exception.BusinessValidationException("Invalid severity");
            }
        }
        incident.setDescription(dto.getDescription());

        return trafficIncidentRepository.save(incident);
    }

    public void deleteIncident(Long id) {
        if (!trafficIncidentRepository.existsById(id)) {
            throw new ResourceNotFoundException("TrafficIncident not found");
        }
        trafficIncidentRepository.deleteById(id);
    }
}