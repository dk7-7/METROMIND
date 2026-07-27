package com.example.demo.repository;

import com.example.demo.entity.UtilityGrid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UtilityGridRepository extends JpaRepository<UtilityGrid, Long> {
List<UtilityGrid> findByDistrict(String district);
Optional<UtilityGrid> findByGridId(Long gridId);
}  