package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "utility_grids")
public class UtilityGrid {
    @Id
    private long gridId;
    @Column(nullable = false)
    private Str
}
