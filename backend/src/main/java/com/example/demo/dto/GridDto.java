package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GridDto {

private String gridName;
private String gridType;
private String district;
private Double capacityUnits;
private Double currentLoad;
private String status;
}