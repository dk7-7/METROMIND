package com.example.demo.dto;

import com.example.demo.enums.IncidentStatus;
import com.example.demo.enums.IncidentType;
import com.example.demo.enums.Severity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IncidentDto {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private IncidentType incidentType;

    @NotNull
    private Severity severity;

    @NotNull
    private IncidentStatus status;

    @NotBlank
    private String location;

    private Double latitude;

    private Double longitude;

    @NotNull
    private Long zoneId;
}