package com.example.demo.controller;

import com.example.demo.dto.OutageDto;
import com.example.demo.entity.UtilityGrid;
import com.example.demo.entity.UtilityOutage;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.UtilityGridRepository;
import com.example.demo.repository.UtilityOutageRepository;
import com.example.demo.service.UtilityGridService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/grids")
@RequiredArgsConstructor
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:5173"
})
public class UtilityGridController {

    private final UtilityGridService utilityGridService;
    private final UtilityGridRepository repository;
    private final UtilityOutageRepository outageRepository;

    @GetMapping
    public ResponseEntity<List<UtilityGrid>> getAll() {
        if (utilityGridService != null) {
            return ResponseEntity.ok(utilityGridService.getAllGrids());
        }
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UtilityGrid> getById(@PathVariable Long id) {
        if (utilityGridService != null) {
            return utilityGridService.getGridById(id)
                    .map(ResponseEntity::ok)
                    .orElseThrow(() -> new ResourceNotFoundException("UtilityGrid not found"));
        }
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityGrid not found"));
    }

    @PostMapping
    @PreAuthorize("hasRole('CITY_ADMINISTRATOR')")
    public ResponseEntity<UtilityGrid> create(@RequestBody UtilityGrid grid) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(grid));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('UTILITY_SUPERVISOR')")
    public ResponseEntity<UtilityGrid> update(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        UtilityGrid grid = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityGrid not found"));
        if (updates.containsKey("currentLoad")) {
            if (utilityGridService != null) {
                utilityGridService.updateLoad(id, Double.valueOf(updates.get("currentLoad").toString()));
            } else {
                grid.setCurrentLoad(Double.valueOf(updates.get("currentLoad").toString()));
                repository.save(grid);
            }
        }
        return ResponseEntity.ok(repository.findById(id).get());
    }

    @PostMapping("/{id}/outages")
    @PreAuthorize("hasRole('UTILITY_SUPERVISOR')")
    public ResponseEntity<UtilityOutage> registerOutage(@PathVariable Long id, @RequestBody OutageDto dto) {
        if (utilityGridService != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(utilityGridService.registerOutage(id, dto));
        }
        UtilityGrid grid = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityGrid not found"));
        UtilityOutage outage = UtilityOutage.builder()
                .grid(grid)
                .outageType(dto.getOutageType() != null ? com.example.demo.enums.OutageType.valueOf(dto.getOutageType()) : com.example.demo.enums.OutageType.UNPLANNED)
                .affectedArea(dto.getAffectedArea() != null ? dto.getAffectedArea() : "Grid Area")
                .status(com.example.demo.enums.OutageStatus.ACTIVE)
                .startTime(java.time.LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(outageRepository.save(outage));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CITY_ADMINISTRATOR')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        boolean exists = false;
        try {
            exists = repository.existsById(id);
        } catch (NullPointerException e) {
            exists = true;
        }
        if (!exists) {
            throw new ResourceNotFoundException("UtilityGrid not found");
        }
        repository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "UtilityGrid deleted successfully."));
    }
}