package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "incident")

public class Trafficincident {
    @Id
    private long incidentId;
    @Column()
    
}
