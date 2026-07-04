package com.example.demo.dto;

import com.example.demo.entity.TrafficIncident;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentDto {

    @NotBlank
    private String title;

    private TrafficIncident.IncidentType incidentType;

    private TrafficIncident.Severity severity;

    @NotNull
    private Long zoneId;

    private String description;
}