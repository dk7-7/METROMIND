package com.example.demo.service;

import com.example.demo.dto.FieldObservationDto;
import com.example.demo.entity.FieldObservation;
import com.example.demo.entity.TrafficIncident;
import com.example.demo.entity.UtilityOutage;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.CityUserRepository;
import com.example.demo.repository.FieldObservationRepository;
import com.example.demo.repository.TrafficIncidentRepository;
import com.example.demo.repository.UtilityOutageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FieldObservationService {

    private final FieldObservationRepository fieldObservationRepository;
    private final TrafficIncidentRepository trafficincidentRepository;
    private final UtilityOutageRepository utilityOutageRepository;
    private final CityUserRepository cityUserRepository;

    public FieldObservation submitObservation(FieldObservationDto dto, String username) {
        TrafficIncident incident = dto.getIncidentId() != null
                ? trafficincidentRepository.findById(dto.getIncidentId())
                    .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"))
                : null;

        UtilityOutage outage = dto.getOutageId() != null
                ? utilityOutageRepository.findById(dto.getOutageId())
                    .orElseThrow(() -> new ResourceNotFoundException("UtilityOutage not found"))
                : null;

        var technician = cityUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        FieldObservation observation = FieldObservation.builder()
                .incident(incident)
                .outage(outage)
                .technician(technician)
                .observationText(dto.getObservationText())
                .sensorReadingValue(dto.getSensorReadingValue())
                .unit(dto.getUnit())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .build();

        return fieldObservationRepository.save(observation);
    }

    @Transactional(readOnly = true)
    public List<FieldObservation> getAllObservations() {
        return fieldObservationRepository.findAll();
    }
}