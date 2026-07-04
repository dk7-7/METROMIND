package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OutageDto {

private String outageType;
private String affectedArea;
private String severity;
private LocalDateTime estimatedRestorationTime;
}