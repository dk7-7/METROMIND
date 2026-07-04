package com.example.demo.entity;

import com.example.demo.enums.GridStatus;
import com.example.demo.enums.GridType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "utility_grids")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UtilityGrid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gridId;

    @Column(nullable = false)
    private String gridName;

    @Column(nullable = false, unique = true)
    private String gridCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GridType gridType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GridStatus status;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private Double capacity;

    @Column(nullable = false)
    private Double currentLoad;

    @Column(nullable = false)
    private String location;

    @OneToMany(mappedBy = "utilityGrid",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<UtilityOutage> outages;
}