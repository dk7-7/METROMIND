package com.example.demo.entity;

import com.example.demo.enums.CongestionLevel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "traffic_zones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrafficZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long zoneId;

    @Column(nullable = false)
    private String zoneName;

    @Column(nullable = false, unique = true)
    private String zoneCode;

    private String district;

    @Enumerated(EnumType.STRING)
    private CongestionLevel currentCongestionLevel;

    private Integer signalCycleSeconds;

    @OneToMany(mappedBy = "zone", cascade = CascadeType.ALL)
    @Builder.Default
    private List<TrafficIncident> incidents = new ArrayList<>();
}