package com.example.demo.service;

import com.example.demo.dto.OutageDto;
import com.example.demo.entity.UtilityGrid;
import com.example.demo.entity.UtilityOutage;
import com.example.demo.enums.GridStatus;
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

    private final UtilityOutageRepository utilityOutageRepository;
    private final UtilityGridRepository utilityGridRepository;

    @Transactional(readOnly = true)
    public List<UtilityOutage> getAllOutages() {
        return utilityOutageRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<UtilityOutage> getOutageById(Long id) {
        return utilityOutageRepository.findById(id);
    }

    public UtilityOutage updateOutage(Long id, OutageDto dto) {
        UtilityOutage outage = utilityOutageRepository.findById(id)
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

        return utilityOutageRepository.save(outage);
    }

    public UtilityOutage resolveOutage(Long id) {
        UtilityOutage outage = utilityOutageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityOutage not found"));

        if (outage.getStatus() == OutageStatus.RESTORED) {
            return outage;
        }

        outage.setStatus(OutageStatus.RESTORED);
        outage.setActualRestorationTime(LocalDateTime.now());
        UtilityOutage saved = utilityOutageRepository.save(outage);

        // Check if there are other active outages for the same grid
        UtilityGrid grid = outage.getGrid();
        if (grid != null) {
            List<UtilityOutage> outages = utilityOutageRepository.findByGrid_GridId(grid.getGridId());
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
        UtilityOutage outage = utilityOutageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityOutage not found"));
        
        utilityOutageRepository.delete(outage);

        // Recheck grid status after deleting outage
        UtilityGrid grid = outage.getGrid();
        if (grid != null) {
            List<UtilityOutage> outages = utilityOutageRepository.findByGrid_GridId(grid.getGridId());
            boolean hasActiveOutages = outages.stream()
                    .anyMatch(o -> o.getStatus() == OutageStatus.ACTIVE || o.getStatus() == OutageStatus.RESOLVING);

            if (!hasActiveOutages) {
                grid.setStatus(GridStatus.OPERATIONAL);
                utilityGridRepository.save(grid);
            }
        }
    }
}
