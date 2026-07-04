package com.example.demo.controller;

import com.example.demo.dto.IncidentDto;
import com.example.demo.entity.TrafficIncident;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.service.TrafficIncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TrafficIncidentController {

    private final TrafficIncidentService trafficIncidentService;

    @GetMapping("/api/incidents")
    public ResponseEntity<List<TrafficIncident>> getAll() {
        return ResponseEntity.ok(trafficIncidentService.getAllIncidents());
    }

    @GetMapping("/api/incidents/{id}")
    public ResponseEntity<TrafficIncident> getById(@PathVariable Long id) {
        return trafficIncidentService.getIncidentById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"));
    }

    @PostMapping("/api/incidents")
    @PreAuthorize("hasAnyRole('CITY_ADMINISTRATOR', 'TRAFFIC_CONTROLLER')")
    public ResponseEntity<String> create(@Valid @RequestBody IncidentDto dto, Authentication auth) {
        trafficIncidentService.reportIncident(dto, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body("TrafficIncident created successfully.");
    }

    @PutMapping("/api/incidents/{id}")
    @PreAuthorize("hasAnyRole('CITY_ADMINISTRATOR', 'TRAFFIC_CONTROLLER')")
    public ResponseEntity<String> update(@PathVariable Long id, @Valid @RequestBody IncidentDto dto) {
        trafficIncidentService.updateIncident(id, dto);
        return ResponseEntity.ok("TrafficIncident updated successfully.");
    }

    @DeleteMapping("/api/incidents/{id}")
    @PreAuthorize("hasRole('CITY_ADMINISTRATOR')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        trafficIncidentService.deleteIncident(id);
        return ResponseEntity.ok("TrafficIncident deleted successfully.");
    }

    @PutMapping("/api/incidents/{id}/dispatch")
    @PreAuthorize("hasRole('TRAFFIC_CONTROLLER')")
    public ResponseEntity<TrafficIncident> dispatch(@PathVariable Long id) {
        return ResponseEntity.ok(trafficIncidentService.dispatchResponse(id));
    }
}