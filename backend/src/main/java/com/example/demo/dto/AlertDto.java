package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlertDto {

private String targetRole;
private String message;
private String severity;
private String relatedEntityType;
private Long relatedEntityId;
}
