package com.example.demo.controller;

import com.example.demo.dto.OutageDto;
import com.example.demo.entity.UtilityOutage;
import com.example.demo.exception.ResourceNotFoundException;
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
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UtilityOutageController {

    private final UtilityOutageService utilityOutageService;

    @GetMapping
    public ResponseEntity<List<UtilityOutage>> getAll() {
        return ResponseEntity.ok(utilityOutageService.getAllOutages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UtilityOutage> getById(@PathVariable Long id) {
        return utilityOutageService.getOutageById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("UtilityOutage not found"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('UTILITY_SUPERVISOR')")
    public ResponseEntity<UtilityOutage> update(@PathVariable Long id, @RequestBody OutageDto dto) {
        return ResponseEntity.ok(utilityOutageService.updateOutage(id, dto));
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('UTILITY_SUPERVISOR')")
    public ResponseEntity<UtilityOutage> resolve(@PathVariable Long id) {
        return ResponseEntity.ok(utilityOutageService.resolveOutage(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CITY_ADMINISTRATOR')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        utilityOutageService.deleteOutage(id);
        return ResponseEntity.ok(Map.of("message", "UtilityOutage deleted successfully."));
    }
}