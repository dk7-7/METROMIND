package com.example.demo.controller;

import com.example.demo.dto.FieldObservationDto;
import com.example.demo.entity.FieldObservation;
import com.example.demo.repository.FieldObservationRepository;
import com.example.demo.service.FieldObservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity; 
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/observations")
@RequiredArgsConstructor 
public class FieldObservationController {

    private final FieldObservationService fieldObservationService;
    private final FieldObservationRepository repository;

    @GetMapping
    public ResponseEntity<List<FieldObservation>> getAll() {
        if (fieldObservationService != null) {
            return ResponseEntity.ok(fieldObservationService.getAllObservations());
        }
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    public ResponseEntity<FieldObservation> create(@RequestBody FieldObservationDto dto, org.springframework.security.core.Authentication auth) {
        String username = auth != null ? auth.getName() : "system";
        if (fieldObservationService != null) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(fieldObservationService.submitObservation(dto, username));
        }
        FieldObservation obs = FieldObservation.builder()
                .observationText(dto.getObservationText() != null ? dto.getObservationText() : "Observation details")
                .latitude(dto.getLatitude() != null ? dto.getLatitude() : 0.0)
                .longitude(dto.getLongitude() != null ? dto.getLongitude() : 0.0)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(obs));
    }
}