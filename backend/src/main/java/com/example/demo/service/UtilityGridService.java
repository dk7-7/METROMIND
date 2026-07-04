package com.example.demo.service;

import com.example.demo.dto.OutageDto;
import com.example.demo.entity.*;
import com.example.demo.enums.*;
import com.example.demo.exception.ResourceNotFoundException;
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

    private final UtilityGridRepository utilityGridRepository;
    private final UtilityOutageRepository utilityOutageRepository;
    private final AlertNotificationRepository alertNotificationRepository;

    public void updateLoad(Long id, Double newLoad) {
        UtilityGrid grid = utilityGridRepository.findById(id)
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
        utilityGridRepository.save(grid);
    }

    public UtilityOutage registerOutage(Long gridId, OutageDto dto) {
        UtilityGrid grid = utilityGridRepository.findById(gridId)
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
        utilityGridRepository.save(grid);

        return saved;
    }

    @Transactional(readOnly = true)
    public List<UtilityGrid> getAllGrids() {
        return utilityGridRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<UtilityGrid> getGridById(Long id) {
        UtilityGrid grid = utilityGridRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityGrid not found"));
        return Optional.of(grid);
    }
}