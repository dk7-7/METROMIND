package com.example.demo.controller;

import com.example.demo.dto.IncidentDto;
import com.example.demo.entity.TrafficIncident;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.TrafficIncidentRepository;
import com.example.demo.service.TrafficIncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor 
public class TrafficIncidentController {

    private final TrafficIncidentService trafficIncidentService;
    private final TrafficIncidentRepository repository;

    @GetMapping
    public ResponseEntity<List<TrafficIncident>> getAll() {
        if (trafficIncidentService != null) {
            return ResponseEntity.ok(trafficIncidentService.getAllIncidents());
        }
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrafficIncident> getById(@PathVariable Long id) {
        if (trafficIncidentService != null) {
            return trafficIncidentService.getIncidentById(id)
                    .map(ResponseEntity::ok)
                    .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"));
        }
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CITY_ADMINISTRATOR', 'TRAFFIC_CONTROLLER')")
    public ResponseEntity<String> create(@Valid @RequestBody IncidentDto dto) {
        String username = SecurityContextHolder.getContext().getAuthentication() != null 
                ? SecurityContextHolder.getContext().getAuthentication().getName() 
                : "system";
        if (trafficIncidentService != null) {
            trafficIncidentService.reportIncident(dto, username);
        } else {
            TrafficIncident incident = TrafficIncident.builder()
                    .title(dto.getTitle())
                    .description(dto.getDescription())
                    .status(com.example.demo.enums.IncidentStatus.REPORTED)
                    .build();
            repository.save(incident);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body("TrafficIncident created successfully.");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CITY_ADMINISTRATOR', 'TRAFFIC_CONTROLLER')")
    public ResponseEntity<String> update(@PathVariable Long id, @Valid @RequestBody IncidentDto dto) {
        if (trafficIncidentService != null) {
            trafficIncidentService.updateIncident(id, dto);
        } else {
            TrafficIncident incident = repository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"));
            incident.setTitle(dto.getTitle());
            incident.setDescription(dto.getDescription());
            repository.save(incident);
        }
        return ResponseEntity.ok("TrafficIncident updated successfully.");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CITY_ADMINISTRATOR')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        if (trafficIncidentService != null) {
            trafficIncidentService.deleteIncident(id);
        } else {
            if (!repository.existsById(id)) {
                throw new ResourceNotFoundException("TrafficIncident not found");
            }
            repository.deleteById(id);
        }
        return ResponseEntity.ok("TrafficIncident deleted successfully.");
    }

    @PutMapping("/{id}/dispatch")
    @PreAuthorize("hasRole('TRAFFIC_CONTROLLER')")
    public ResponseEntity<TrafficIncident> dispatch(@PathVariable Long id, @RequestBody(required = false) Object dummy) {
        if (trafficIncidentService != null) {
            return ResponseEntity.ok(trafficIncidentService.dispatchResponse(id));
        }
        TrafficIncident incident = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"));
        incident.setStatus(com.example.demo.enums.IncidentStatus.DISPATCHED);
        return ResponseEntity.ok(repository.save(incident));
    }
}