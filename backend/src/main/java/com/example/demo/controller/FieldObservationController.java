package com.example.demo.controller;

import com.example.demo.dto.FieldObservationDto;
import com.example.demo.entity.FieldObservation;
import com.example.demo.repository.FieldObservationRepository;
import com.example.demo.service.FieldObservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public ResponseEntity<FieldObservation> create(@RequestBody FieldObservationDto dto) {
        String username = SecurityContextHolder.getContext().getAuthentication() != null 
                ? SecurityContextHolder.getContext().getAuthentication().getName() 
                : "system";
        if (fieldObservationService != null) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(fieldObservationService.submitObservation(dto, username));
        }
        FieldObservation obs = FieldObservation.builder()
                .details(dto.getDetails())
                .observationTime(java.time.LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(obs));
    }
}