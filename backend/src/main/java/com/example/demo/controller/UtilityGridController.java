package com.example.demo.controller;

import com.example.demo.dto.OutageDto;
import com.example.demo.entity.UtilityGrid;
import com.example.demo.entity.UtilityOutage;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.UtilityGridRepository;
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
public class UtilityGridController {

    private final UtilityGridService utilityGridService;
    private final UtilityGridRepository repository;

    @GetMapping
    public ResponseEntity<List<UtilityGrid>> getAll() {
        return ResponseEntity.ok(utilityGridService.getAllGrids());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UtilityGrid> getById(@PathVariable Long id) {
        return utilityGridService.getGridById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityGrid not found"));
    }

    // @PostMapping
    // @PreAuthorize("hasRole('CITY_ADMINISTRATOR')")
    // public ResponseEntity<UtilityGrid> create(@RequestBody UtilityGrid grid) {
    //     return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(grid));
    // }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('UTILITY_SUPERVISOR')")
    public ResponseEntity<UtilityGrid> update(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        UtilityGrid grid = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityGrid not found"));
        if (updates.containsKey("currentLoad")) {
            utilityGridService.updateLoad(id, Double.valueOf(updates.get("currentLoad").toString()));
        }
        return ResponseEntity.ok(repository.findById(id).get());
    }

    @PostMapping("/{id}/outages")
    @PreAuthorize("hasRole('UTILITY_SUPERVISOR')")
    public ResponseEntity<UtilityOutage> registerOutage(@PathVariable Long id, @RequestBody OutageDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(utilityGridService.registerOutage(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CITY_ADMINISTRATOR')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("UtilityGrid not found");
        }
        repository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "UtilityGrid deleted successfully."));
    }
}