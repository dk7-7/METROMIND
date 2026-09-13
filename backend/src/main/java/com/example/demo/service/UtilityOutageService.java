package com.example.demo.service;

import com.example.demo.dto.OutageDto;
import com.example.demo.entity.UtilityGrid;
import com.example.demo.entity.UtilityOutage;
import com.example.demo.enums.GridStatus;
import com.example.demo.enums.GridType;
import com.example.demo.enums.OutageStatus;
import com.example.demo.enums.OutageType;
import com.example.demo.enums.Severity;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.UtilityGridRepository;
import com.example.demo.repository.UtilityOutageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UtilityOutageService {

    private final UtilityOutageRepository repository;
    private final UtilityGridRepository utilityGridRepository;

    @Transactional(readOnly = true)
    public List<UtilityOutage> getAllOutages() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<UtilityOutage> getOutageById(Long id) {
        return repository.findById(id);
    }

    public UtilityOutage createOutage(OutageDto dto) {
        if (dto.getAffectedArea() == null || dto.getAffectedArea().trim().isEmpty()) {
            throw new com.example.demo.exception.BusinessValidationException("Affected area cannot be empty");
        }

        OutageType type = OutageType.UNPLANNED;
        if (dto.getOutageType() != null && !dto.getOutageType().trim().isEmpty()) {
            try {
                type = OutageType.valueOf(dto.getOutageType().trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new com.example.demo.exception.BusinessValidationException("Invalid outage type");
            }
        }

        Severity severity = Severity.MEDIUM;
        if (dto.getSeverity() != null && !dto.getSeverity().trim().isEmpty()) {
            try {
                severity = Severity.valueOf(dto.getSeverity().trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new com.example.demo.exception.BusinessValidationException("Invalid severity");
            }
        }

        UtilityGrid grid = null;
        if (dto.getGridId() != null) {
            grid = utilityGridRepository.findById(dto.getGridId())
                    .orElseThrow(() -> new ResourceNotFoundException("UtilityGrid not found"));
        } else {
            List<UtilityGrid> grids = utilityGridRepository.findAll();
            if (!grids.isEmpty()) {
                grid = grids.stream()
                        .filter(g -> g.getDistrict() != null && dto.getAffectedArea() != null &&
                                (dto.getAffectedArea().toLowerCase().contains(g.getDistrict().toLowerCase()) ||
                                 g.getGridName().toLowerCase().contains(dto.getAffectedArea().toLowerCase())))
                        .findFirst()
                        .orElse(grids.get(0));
            }
        }

        if (grid == null) {
            grid = utilityGridRepository.save(UtilityGrid.builder()
                    .gridName("Central Power Grid")
                    .gridType(GridType.POWER)
                    .district("Central")
                    .capacityUnits(500.0)
                    .currentLoad(300.0)
                    .status(GridStatus.DEGRADED)
                    .build());
        }

        UtilityOutage outage = UtilityOutage.builder()
                .grid(grid)
                .outageType(type)
                .affectedArea(dto.getAffectedArea().trim())
                .estimatedRestorationTime(dto.getEstimatedRestorationTime())
                .status(OutageStatus.ACTIVE)
                .severity(severity)
                .startTime(LocalDateTime.now())
                .build();

        UtilityOutage saved = repository.save(outage);

        grid.setStatus(GridStatus.DEGRADED);
        utilityGridRepository.save(grid);

        return saved;
    }

    public UtilityOutage updateOutage(Long id, OutageDto dto) {
        UtilityOutage outage = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityOutage not found"));

        if (dto.getOutageType() != null) {
            try {
                outage.setOutageType(OutageType.valueOf(dto.getOutageType()));
            } catch (IllegalArgumentException e) {
                throw new com.example.demo.exception.BusinessValidationException("Invalid outage type");
            }
        }
        if (dto.getAffectedArea() != null) {
            outage.setAffectedArea(dto.getAffectedArea());
        }
        if (dto.getSeverity() != null) {
            try {
                outage.setSeverity(Severity.valueOf(dto.getSeverity()));
            } catch (IllegalArgumentException e) {
                throw new com.example.demo.exception.BusinessValidationException("Invalid severity");
            }
        }
        if (dto.getEstimatedRestorationTime() != null) {
            outage.setEstimatedRestorationTime(dto.getEstimatedRestorationTime());
        }

        return repository.save(outage);
    }

    public UtilityOutage resolveOutage(Long id) {
        UtilityOutage outage = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityOutage not found"));

        if (outage.getStatus() == OutageStatus.RESTORED) {
            return outage;
        }

        outage.setStatus(OutageStatus.RESTORED);
        outage.setActualRestorationTime(LocalDateTime.now());
        UtilityOutage saved = repository.save(outage);

        // Check if there are other active outages for the same grid
        UtilityGrid grid = outage.getGrid();
        if (grid != null) {
            List<UtilityOutage> outages = repository.findByGrid_GridId(grid.getGridId());
            boolean hasActiveOutages = outages.stream()
                    .anyMatch(o -> o.getStatus() == OutageStatus.ACTIVE || o.getStatus() == OutageStatus.RESOLVING);

            if (!hasActiveOutages) {
                grid.setStatus(GridStatus.OPERATIONAL);
                utilityGridRepository.save(grid);
            }
        }

        return saved;
    }

    public void deleteOutage(Long id) {
        UtilityOutage outage = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityOutage not found"));
        
        repository.delete(outage);

        // Recheck grid status after deleting outage
        UtilityGrid grid = outage.getGrid();
        if (grid != null) {
            List<UtilityOutage> outages = repository.findByGrid_GridId(grid.getGridId());
            boolean hasActiveOutages = outages.stream()
                    .anyMatch(o -> o.getStatus() == OutageStatus.ACTIVE || o.getStatus() == OutageStatus.RESOLVING);

            if (!hasActiveOutages) {
                grid.setStatus(GridStatus.OPERATIONAL);
                utilityGridRepository.save(grid);
            }
        }
    }
}
