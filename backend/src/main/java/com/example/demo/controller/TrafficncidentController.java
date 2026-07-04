package com.example.demo.controller;

import com.example.demo.dto.IncidentDto;
import com.example.demo.entity.Trafficincident;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.service.TrafficincidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TrafficncidentController {

    private final TrafficincidentService trafficIncidentService;

    @GetMapping
    public ResponseEntity<List<Trafficincident>> getAll() {
        return ResponseEntity.ok(trafficIncidentService.getAllIncidents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trafficincident> getById(@PathVariable Long id) {
        return trafficIncidentService.getIncidentById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CITY_ADMINISTRATOR', 'TRAFFIC_CONTROLLER')")
    public ResponseEntity<String> create(@Valid @RequestBody IncidentDto dto, Authentication auth) {
        trafficIncidentService.reportIncident(dto, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body("TrafficIncident created successfully.");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CITY_ADMINISTRATOR', 'TRAFFIC_CONTROLLER')")
    public ResponseEntity<String> update(@PathVariable Long id, @Valid @RequestBody IncidentDto dto) {
        trafficIncidentService.updateIncident(id, dto);
        return ResponseEntity.ok("TrafficIncident updated successfully.");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CITY_ADMINISTRATOR')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        trafficIncidentService.deleteIncident(id);
        return ResponseEntity.ok("TrafficIncident deleted successfully.");
    }

    @PutMapping("/{id}/dispatch")
    @PreAuthorize("hasRole('TRAFFIC_CONTROLLER')")
    public ResponseEntity<Trafficincident> dispatch(@PathVariable Long id) {
        return ResponseEntity.ok(trafficIncidentService.dispatchResponse(id));
    }
}