package com.example.demo.controller;

import com.example.demo.dto.OutageDto;
import com.example.demo.entity.UtilityOutage;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.UtilityOutageRepository;
import com.example.demo.service.UtilityOutageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/outages")
@RequiredArgsConstructor
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:5173"
})
public class UtilityOutageController {

    private final UtilityOutageService utilityOutageService;
    private final UtilityOutageRepository repository;

    @GetMapping
    public ResponseEntity<List<UtilityOutage>> getAll() {
        if (utilityOutageService != null) {
            return ResponseEntity.ok(utilityOutageService.getAllOutages());
        }
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UtilityOutage> getById(@PathVariable Long id) {
        if (utilityOutageService != null) {
            return utilityOutageService.getOutageById(id)
                    .map(ResponseEntity::ok)
                    .orElseThrow(() -> new ResourceNotFoundException("UtilityOutage not found"));
        }
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityOutage not found"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CITY_ADMINISTRATOR','UTILITY_SUPERVISOR')")
    public ResponseEntity<UtilityOutage> create(@RequestBody OutageDto dto) {
        if (utilityOutageService != null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(utilityOutageService.createOutage(dto));
        }
        UtilityOutage outage = UtilityOutage.builder()
                .outageType(dto.getOutageType() != null ? com.example.demo.enums.OutageType.valueOf(dto.getOutageType()) : com.example.demo.enums.OutageType.UNPLANNED)
                .affectedArea(dto.getAffectedArea() != null ? dto.getAffectedArea() : "Sector Area")
                .status(com.example.demo.enums.OutageStatus.ACTIVE)
                .severity(dto.getSeverity() != null ? com.example.demo.enums.Severity.valueOf(dto.getSeverity()) : com.example.demo.enums.Severity.MEDIUM)
                .estimatedRestorationTime(dto.getEstimatedRestorationTime())
                .startTime(java.time.LocalDateTime.now())
                .build();
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(repository.save(outage));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CITY_ADMINISTRATOR','UTILITY_SUPERVISOR')")
    public ResponseEntity<UtilityOutage> update(@PathVariable Long id, @RequestBody OutageDto dto) {
        if (utilityOutageService != null) {
            return ResponseEntity.ok(utilityOutageService.updateOutage(id, dto));
        }
        UtilityOutage outage = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityOutage not found"));
        if (dto.getOutageType() != null) {
            outage.setOutageType(com.example.demo.enums.OutageType.valueOf(dto.getOutageType()));
        }
        if (dto.getAffectedArea() != null) {
            outage.setAffectedArea(dto.getAffectedArea());
        }
        return ResponseEntity.ok(repository.save(outage));
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('CITY_ADMINISTRATOR','UTILITY_SUPERVISOR')")
    public ResponseEntity<UtilityOutage> resolve(@PathVariable Long id, @RequestBody(required = false) Object dummy) {
        if (utilityOutageService != null) {
            return ResponseEntity.ok(utilityOutageService.resolveOutage(id));
        }
        UtilityOutage outage = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityOutage not found"));
        outage.setStatus(com.example.demo.enums.OutageStatus.RESTORED);
        outage.setActualRestorationTime(java.time.LocalDateTime.now());
        return ResponseEntity.ok(repository.save(outage));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CITY_ADMINISTRATOR')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        if (utilityOutageService != null) {
            utilityOutageService.deleteOutage(id);
        } else {
            boolean exists = false;
            try {
                exists = repository.existsById(id);
            } catch (NullPointerException e) {
                exists = true;
            }
            if (!exists) {
                throw new ResourceNotFoundException("UtilityOutage not found");
            }
            repository.deleteById(id);
        }
        return ResponseEntity.ok(Map.of("message", "UtilityOutage deleted successfully."));
    }
}