package com.example.demo.entity;

import com.example.demo.enums.GridStatus;
import com.example.demo.enums.GridType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
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
    @Builder.Default
    private GridStatus status = GridStatus.OPERATIONAL;

    @Column(nullable = false)
    private String district;

    private Double capacity;

    private Double currentLoad;

    private String location;

    @OneToMany(mappedBy = "utilityGrid",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    @Builder.Default
    private List<UtilityOutage> outages = new ArrayList<>();
}