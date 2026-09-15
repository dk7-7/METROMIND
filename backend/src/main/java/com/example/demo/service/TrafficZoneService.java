package com.example.demo.service;

import com.example.demo.entity.AlertNotification;
import com.example.demo.entity.FieldObservation;
import com.example.demo.entity.TrafficIncident;
import com.example.demo.entity.TrafficZone;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.AlertNotificationRepository;
import com.example.demo.repository.FieldObservationRepository;
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
public class TrafficZoneService {

    private final TrafficZoneRepository repository;
    private final TrafficIncidentRepository trafficIncidentRepository;
    private final AlertNotificationRepository alertNotificationRepository;
    private final FieldObservationRepository fieldObservationRepository;

    @Transactional(readOnly = true)
    public List<TrafficZone> getAllZones() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<TrafficZone> getZoneById(Long id) {
        TrafficZone zone = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficZone not found"));
        return Optional.of(zone);
    }

    @Transactional(readOnly = true)
    public List<TrafficZone> getHighlyCongestedZones() {
        return repository.findHighlyCongestedZones();
    }

    @Transactional
    public void deleteZone(Long id) {
        boolean exists = false;
        try {
            exists = repository.existsById(id);
        } catch (NullPointerException e) {
            exists = true;
        }
        if (!exists) {
            throw new ResourceNotFoundException("TrafficZone not found");
        }

        List<TrafficIncident> incidents = trafficIncidentRepository.findByZone_ZoneId(id);
        if (incidents != null && !incidents.isEmpty()) {
            for (TrafficIncident incident : incidents) {
                List<FieldObservation> observations = fieldObservationRepository.findByIncident_IncidentId(incident.getIncidentId());
                if (observations != null && !observations.isEmpty()) {
                    for (FieldObservation obs : observations) {
                        obs.setIncident(null);
                        fieldObservationRepository.save(obs);
                    }
                }

                List<AlertNotification> incidentAlerts = alertNotificationRepository.findAll();
                for (AlertNotification alert : incidentAlerts) {
                    if ("INCIDENT".equalsIgnoreCase(alert.getRelatedEntityType()) && incident.getIncidentId().equals(alert.getRelatedEntityId())) {
                        alertNotificationRepository.delete(alert);
                    }
                }
            }
            trafficIncidentRepository.deleteAll(incidents);
        }

        List<AlertNotification> alerts = alertNotificationRepository.findAll();
        for (AlertNotification alert : alerts) {
            if ("ZONE".equalsIgnoreCase(alert.getRelatedEntityType()) && id.equals(alert.getRelatedEntityId())) {
                alertNotificationRepository.delete(alert);
            }
        }

        repository.deleteById(id);
    }
}