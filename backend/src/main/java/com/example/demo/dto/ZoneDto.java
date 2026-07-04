
package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZoneDto {

@NotBlank
private String zoneName;

@NotBlank
private String zoneCode;

private String district;

private String currentCongestionLevel;

private Integer signalCycleSeconds;
}
 