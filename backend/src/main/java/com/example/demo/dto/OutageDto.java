package com.example.demo.dto;

import com.example.demo.enums.OutageStatus;
import com.example.demo.enums.OutageType;
import com.example.demo.enums.Severity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OutageDto {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private OutageType outageType;

    @NotNull
    private Severity severity;

    @NotNull
    private OutageStatus status;

    @NotBlank
    private String affectedArea;

    @NotNull
    private Long gridId;

    private Long assignedTechnicianId;
}