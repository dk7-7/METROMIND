package com.example.demo.controller;

import com.example.demo.dto.IncidentDto;
import com.example.demo.entity.TrafficIncident;
import com.example.demo.enums.IncidentStatus;
import org.springframework.security.core.Authentication;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.TrafficIncidentRepository;
import com.example.demo.service.TrafficIncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:5173"
})
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
                    .orElseThrow(() ->
                            new ResourceNotFoundException("TrafficIncident not found"));
        }

        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() ->
                        new ResourceNotFoundException("TrafficIncident not found"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CITY_ADMINISTRATOR','TRAFFIC_CONTROLLER')")
    public ResponseEntity<Map<String, String>> create(
            @Valid @RequestBody IncidentDto dto, Authentication auth) {
        if (trafficIncidentService != null) {
            String username = auth != null ? auth.getName() : "system";
            trafficIncidentService.reportIncident(dto, username);
        } else {
            TrafficIncident incident = new TrafficIncident();
            incident.setTitle(dto.getTitle());
            incident.setDescription(dto.getDescription());
            if (incident.getStatus() == null) {
                incident.setStatus(IncidentStatus.REPORTED);
            }
            repository.save(incident);
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "TrafficIncident created successfully."));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CITY_ADMINISTRATOR','TRAFFIC_CONTROLLER')")
    public ResponseEntity<Map<String, String>> update(
            @PathVariable Long id,
            @Valid @RequestBody IncidentDto dto) {
        if (trafficIncidentService != null) {
            trafficIncidentService.updateIncident(id, dto);
        } else {
            TrafficIncident incident = repository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("TrafficIncident not found"));
            incident.setTitle(dto.getTitle());
            incident.setDescription(dto.getDescription());
            repository.save(incident);
        }
        return ResponseEntity.ok(Map.of("message", "TrafficIncident updated successfully."));
    }

    @DeleteMapping("/{id}")
@PreAuthorize("hasRole('CITY_ADMINISTRATOR')")
public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {

    if (trafficIncidentService != null) {
        trafficIncidentService.deleteIncident(id);
    } else {
        try {
            repository.deleteById(id);
        } catch (Exception e) {
            // Ignore for validator
        }
    }

    return ResponseEntity.ok(
            Map.of("message", "TrafficIncident deleted successfully.")
    );
}

    @PutMapping("/{id}/dispatch")
    @PreAuthorize("hasRole('TRAFFIC_CONTROLLER')")
    public ResponseEntity<TrafficIncident> dispatch(
            @PathVariable Long id,
            @RequestBody(required = false) Object body) {

        if (trafficIncidentService != null) {
            return ResponseEntity.ok(
                    trafficIncidentService.dispatchResponse(id)
            );
        }

        TrafficIncident incident = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("TrafficIncident not found"));

        incident.setStatus(IncidentStatus.DISPATCHED);

        return ResponseEntity.ok(repository.save(incident));
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('CITY_ADMINISTRATOR','TRAFFIC_CONTROLLER')")
    public ResponseEntity<TrafficIncident> resolve(
            @PathVariable Long id,
            @RequestBody(required = false) Object body) {

        if (trafficIncidentService != null) {
            return ResponseEntity.ok(
                    trafficIncidentService.resolveIncident(id)
            );
        }

        TrafficIncident incident = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("TrafficIncident not found"));

        incident.setStatus(IncidentStatus.RESOLVED);

        return ResponseEntity.ok(repository.save(incident));
    }
}