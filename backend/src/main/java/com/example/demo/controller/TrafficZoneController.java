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

@RestController
@RequestMapping("/api/zones")
@RequiredArgsConstructor
public class TrafficZoneController {

    private final TrafficZoneService trafficZoneService;
    private final TrafficZoneRepository repository;

    @GetMapping
    public ResponseEntity<List<TrafficZone>> getAll() {
        return ResponseEntity.ok(trafficZoneService.getAllZones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrafficZone> getById(@PathVariable Long id) {
        return trafficZoneService.getZoneById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficZone not found"));
    }

    @GetMapping("/congested")
    public ResponseEntity<List<TrafficZone>> getCongested() {
        return ResponseEntity.ok(trafficZoneService.getHighlyCongestedZones());
    }

    // @PostMapping
    // @PreAuthorize("hasRole('CITY_ADMINISTRATOR')")
    // public ResponseEntity<TrafficZone> create(@RequestBody ZoneDto dto) {
    //     TrafficZone zone = TrafficZone.builder()
    //             .zoneName(dto.getZoneName())
    //             .zoneCode(dto.getZoneCode())
    //             .district(dto.getDistrict())
    //             .currentCongestionLevel(dto.getCurrentCongestionLevel() != null
    //                     ? CongestionLevel.valueOf(dto.getCurrentCongestionLevel()) : CongestionLevel.LOW)
    //             .signalCycleSeconds(dto.getSignalCycleSeconds() != null ? dto.getSignalCycleSeconds() : 60)
    //             .build();
    //     return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(zone));
    // }

    // @PutMapping("/{id}")
    // @PreAuthorize("hasRole('CITY_ADMINISTRATOR')")
    // public ResponseEntity<TrafficZone> update(@PathVariable Long id, @RequestBody ZoneDto dto) {
    //     TrafficZone zone = repository.findById(id)
    //             .orElseThrow(() -> new ResourceNotFoundException("TrafficZone not found"));
    //     zone.setZoneName(dto.getZoneName());
    //     zone.setDistrict(dto.getDistrict());
    //     if (dto.getCurrentCongestionLevel() != null) {
    //         zone.setCurrentCongestionLevel(CongestionLevel.valueOf(dto.getCurrentCongestionLevel()));
    //     }
    //     if (dto.getSignalCycleSeconds() != null) {
    //         zone.setSignalCycleSeconds(dto.getSignalCycleSeconds());
    //     }
    //     return ResponseEntity.ok(repository.save(zone));
    // }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CITY_ADMINISTRATOR')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        trafficZoneService.deleteZone(id);
        return ResponseEntity.ok("TrafficZone deleted successfully.");
    }
}