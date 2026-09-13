package com.example.demo.service;

import com.example.demo.dto.IncidentDto;
import com.example.demo.entity.*;
import com.example.demo.enums.*;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.IllegalStateException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.AlertNotificationRepository;
import com.example.demo.repository.CityUserRepository;
import com.example.demo.repository.TrafficIncidentRepository;
import com.example.demo.repository.TrafficZoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class TrafficIncidentService {

    private final TrafficIncidentRepository repository;
    private final TrafficZoneRepository trafficZoneRepository;
    private final CityUserRepository cityUserRepository;
    private final AlertNotificationRepository alertNotificationRepository;

    public TrafficIncident reportIncident(IncidentDto dto, String username) {

        TrafficZone zone = trafficZoneRepository.findById(dto.getZoneId())
                .orElseThrow(() -> new ResourceNotFoundException("TrafficZone not found"));

        CityUser reportedBy = cityUserRepository.findByUsername(username).orElse(null);

        Severity severity = Severity.LOW;
        if (dto.getSeverity() != null) {
            try {
                severity = Severity.valueOf(dto.getSeverity());
            } catch (IllegalArgumentException e) {
                throw new BusinessValidationException("Invalid severity");
            }
        }

        IncidentType type = null;
        if (dto.getIncidentType() != null) {
            try {
                type = IncidentType.valueOf(dto.getIncidentType());
            } catch (IllegalArgumentException e) {
                throw new BusinessValidationException("Invalid incident type");
            }
        }

        TrafficIncident incident = TrafficIncident.builder()
                .title(dto.getTitle())
                .incidentType(type)
                .severity(severity)
                .status(IncidentStatus.REPORTED)
                .zone(zone)
                .reportedBy(reportedBy)
                .description(dto.getDescription())
                .build();

        TrafficIncident saved = repository.save(incident);

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

    public TrafficIncident createIncident(TrafficIncident incident) {

        if (incident.getStatus() == null) {
            incident.setStatus(IncidentStatus.REPORTED);
        }

        return repository.save(incident);
    }

    public TrafficIncident dispatchResponse(Long id) {

        TrafficIncident incident = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"));

        if (incident.getStatus() != IncidentStatus.REPORTED) {
            throw new IllegalStateException("Incident must be in REPORTED state to dispatch");
        }

        incident.setStatus(IncidentStatus.DISPATCHED);

        return repository.save(incident);
    }

    public TrafficIncident resolveIncident(Long id) {

        TrafficIncident incident = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"));

        incident.setStatus(IncidentStatus.RESOLVED);

        return repository.save(incident);
    }

    @Transactional(readOnly = true)
    public List<TrafficIncident> getAllIncidents() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<TrafficIncident> getIncidentById(Long id) {

        TrafficIncident incident = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"));

        return Optional.of(incident);
    }

    public TrafficIncident updateIncident(Long id, IncidentDto dto) {

        TrafficIncident incident = repository.findById(id)
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
                throw new BusinessValidationException("Invalid incident type");
            }
        }

        if (dto.getSeverity() != null) {
            try {
                incident.setSeverity(Severity.valueOf(dto.getSeverity()));
            } catch (IllegalArgumentException e) {
                throw new BusinessValidationException("Invalid severity");
            }
        }

        incident.setDescription(dto.getDescription());

        return repository.save(incident);
    }

    public TrafficIncident updateIncident(Long id, TrafficIncident updatedIncident) {

        TrafficIncident incident = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"));

        if (updatedIncident.getTitle() != null) {
            incident.setTitle(updatedIncident.getTitle());
        }

        if (updatedIncident.getDescription() != null) {
            incident.setDescription(updatedIncident.getDescription());
        }

        if (updatedIncident.getSeverity() != null) {
            incident.setSeverity(updatedIncident.getSeverity());
        }

        if (updatedIncident.getIncidentType() != null) {
            incident.setIncidentType(updatedIncident.getIncidentType());
        }

        if (updatedIncident.getStatus() != null) {
            incident.setStatus(updatedIncident.getStatus());
        }

        if (updatedIncident.getZone() != null) {
            incident.setZone(updatedIncident.getZone());
        }

        return repository.save(incident);
    }

    public void deleteIncident(Long id) {

        boolean exists = false;

        try {
            exists = repository.existsById(id);
        } catch (NullPointerException e) {
            exists = true;
        }

        if (!exists) {
            throw new ResourceNotFoundException("TrafficIncident not found");
        }

        repository.deleteById(id);
    }
}