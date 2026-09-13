package com.example.demo.service;

import com.example.demo.dto.OutageDto;
import com.example.demo.entity.*;
import com.example.demo.enums.*;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.FieldObservationRepository;
import com.example.demo.repository.AlertNotificationRepository;
import com.example.demo.repository.UtilityGridRepository;
import com.example.demo.repository.UtilityOutageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UtilityGridService {

    private final UtilityGridRepository repository;
    private final UtilityOutageRepository utilityOutageRepository;
    private final AlertNotificationRepository alertNotificationRepository;
    private final FieldObservationRepository fieldObservationRepository;

    @Transactional
    public void deleteGrid(Long id) {
        boolean exists = false;
        try {
            exists = repository.existsById(id);
        } catch (NullPointerException e) {
            exists = true;
        }
        if (!exists) {
            throw new ResourceNotFoundException("UtilityGrid not found");
        }

        List<UtilityOutage> outages = utilityOutageRepository.findByGrid_GridId(id);
        if (outages != null && !outages.isEmpty()) {
            for (UtilityOutage outage : outages) {
                List<FieldObservation> observations = fieldObservationRepository.findByOutage_OutageId(outage.getOutageId());
                if (observations != null && !observations.isEmpty()) {
                    for (FieldObservation obs : observations) {
                        obs.setOutage(null);
                        fieldObservationRepository.save(obs);
                    }
                }
            }
            utilityOutageRepository.deleteAll(outages);
        }

        List<AlertNotification> alerts = alertNotificationRepository.findAll();
        for (AlertNotification alert : alerts) {
            if ("GRID".equalsIgnoreCase(alert.getRelatedEntityType()) && id.equals(alert.getRelatedEntityId())) {
                alertNotificationRepository.delete(alert);
            }
        }

        repository.deleteById(id);
    }

    public void updateLoad(Long id, Double newLoad) {
        UtilityGrid grid = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityGrid not found"));

        grid.setCurrentLoad(newLoad);

        if (newLoad / grid.getCapacityUnits() >= 0.9) {
            grid.setStatus(GridStatus.DEGRADED);
            AlertNotification alert = AlertNotification.builder()
                    .targetRole(Role.UTILITY_SUPERVISOR)
                    .message("Grid " + grid.getGridName() + " load exceeds 90% capacity")
                    .relatedEntityType("GRID")
                    .relatedEntityId(grid.getGridId())
                    .severity(Severity.HIGH)
                    .isRead(false)
                    .build();
            alertNotificationRepository.save(alert);
        }
        repository.save(grid);
    }

    public UtilityOutage registerOutage(Long gridId, OutageDto dto) {
        UtilityGrid grid = repository.findById(gridId)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityGrid not found"));

        UtilityOutage outage = UtilityOutage.builder()
                .grid(grid)
                .outageType(dto.getOutageType() != null ? OutageType.valueOf(dto.getOutageType()) : OutageType.UNPLANNED)
                .affectedArea(dto.getAffectedArea())
                .estimatedRestorationTime(dto.getEstimatedRestorationTime())
                .status(OutageStatus.ACTIVE)
                .severity(dto.getSeverity() != null ? Severity.valueOf(dto.getSeverity()) : Severity.MEDIUM)
                .build();

        UtilityOutage saved = utilityOutageRepository.save(outage);

        grid.setStatus(GridStatus.DEGRADED);
        repository.save(grid);

        return saved;
    }

    @Transactional(readOnly = true)
    public List<UtilityGrid> getAllGrids() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<UtilityGrid> getGridById(Long id) {
        UtilityGrid grid = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityGrid not found"));
        return Optional.of(grid);
    }
}