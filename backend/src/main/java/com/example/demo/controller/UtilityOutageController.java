package com.example.demo.controller;

import com.example.demo.entity.UtilityOutage;
import com.example.demo.repository.UtilityOutageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/outages")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UtilityOutageController {

    private final UtilityOutageRepository utilityOutageRepository;

    @GetMapping
    public ResponseEntity<List<UtilityOutage>> getAll() {
        return ResponseEntity.ok(utilityOutageRepository.findAll());
    }
}