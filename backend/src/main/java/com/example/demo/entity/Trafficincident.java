package com.example.demo.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "traffic_incident")
@Data
public class Trafficincident {
    @Id
    private long incidentId;
    @Column(nullable = false)
    private String title;
    
    @ManyToOne TrafficZone
    zone;

    
}
