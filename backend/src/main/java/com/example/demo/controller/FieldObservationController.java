package com.example.demo.controller;

import com.example.demo.dto.FieldObservationDto;
import com.example.demo.entity.FieldObservation;
import com.example.demo.service.FieldObservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/observations")
@RequiredArgsConstructor 
public class FieldObservationController {

    private final FieldObservationService fieldObservationService;

    @GetMapping
    public ResponseEntity<List<FieldObservation>> getAll() {
        return ResponseEntity.ok(fieldObservationService.getAllObservations());
    }

    @PostMapping
    public ResponseEntity<FieldObservation> create(@RequestBody FieldObservationDto dto, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(fieldObservationService.submitObservation(dto, auth.getName()));
    }
}