package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class UtilityOutage {
    @Id
    private long outageId;
    @ManyToOne UtilityGrid
    grid;
    
}
