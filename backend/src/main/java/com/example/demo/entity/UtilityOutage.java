package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class UtilityOutage {
    @Id
    private long outage;
}
