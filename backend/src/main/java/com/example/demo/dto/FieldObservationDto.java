package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FieldObservationDto {

private Long incidentId;
private Long outageId;
private String observationText;
private Double sensorReadingValue;
private String unit;
private Double latitude;
private Double longitude;
}