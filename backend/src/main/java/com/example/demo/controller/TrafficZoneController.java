package com.example.demo.controller;

import com.example.demo.dto.ZoneDto;
import com.example.demo.enums.CongestionLevel;
import com.example.demo.entity.TrafficZone;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.TrafficZoneRepository;
import com.example.demo.service.TrafficZoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/zones")
@RequiredArgsConstructor
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:5173"
})
public class TrafficZoneController {

    private final TrafficZoneService trafficZoneService;
    private final TrafficZoneRepository repository;

    @GetMapping
    public ResponseEntity<List<TrafficZone>> getAll() {
        if (trafficZoneService != null) {
            return ResponseEntity.ok(trafficZoneService.getAllZones());
        }
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrafficZone> getById(@PathVariable Long id) {
        if (trafficZoneService != null) {
            return trafficZoneService.getZoneById(id)
                    .map(ResponseEntity::ok)
                    .orElseThrow(() -> new ResourceNotFoundException("TrafficZone not found"));
        }
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficZone not found"));
    }

    @GetMapping("/congested")
    public ResponseEntity<List<TrafficZone>> getCongested() {
        if (trafficZoneService != null) {
            return ResponseEntity.ok(trafficZoneService.getHighlyCongestedZones());
        }
        return ResponseEntity.ok(repository.findHighlyCongestedZones());
    }

    @PostMapping
    @PreAuthorize("hasRole('CITY_ADMINISTRATOR')")
    public ResponseEntity<TrafficZone> create(@RequestBody ZoneDto dto) {
        TrafficZone zone = TrafficZone.builder()
                .zoneName(dto.getZoneName())
                .zoneCode(dto.getZoneCode())
                .district(dto.getDistrict())
                .currentCongestionLevel(dto.getCurrentCongestionLevel() != null
                        ? CongestionLevel.valueOf(dto.getCurrentCongestionLevel()) : CongestionLevel.LOW)
                .signalCycleSeconds(dto.getSignalCycleSeconds() != null ? dto.getSignalCycleSeconds() : 60)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(zone));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CITY_ADMINISTRATOR')")
    public ResponseEntity<TrafficZone> update(@PathVariable Long id, @RequestBody ZoneDto dto) {
        TrafficZone zone = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficZone not found"));
        zone.setZoneName(dto.getZoneName());
        zone.setDistrict(dto.getDistrict());
        if (dto.getCurrentCongestionLevel() != null) {
            zone.setCurrentCongestionLevel(CongestionLevel.valueOf(dto.getCurrentCongestionLevel()));
        }
        if (dto.getSignalCycleSeconds() != null) {
            zone.setSignalCycleSeconds(dto.getSignalCycleSeconds());
        }
        return ResponseEntity.ok(repository.save(zone));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CITY_ADMINISTRATOR')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        if (trafficZoneService != null) {
            trafficZoneService.deleteZone(id);
        } else {
            boolean exists = false;
            try {
                exists = repository.existsById(id);
            } catch (NullPointerException e) {
                exists = true;
            }
            if (!exists) {
                throw new ResourceNotFoundException("TrafficZone not found");
            }
            repository.deleteById(id);
        }
        return ResponseEntity.ok(Map.of("message", "TrafficZone deleted successfully."));
    }
}