package com.example.demo.repository;

import com.example.demo.entity.UtilityGrid;
import com.example.demo.enums.GridStatus;
import com.example.demo.enums.GridType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UtilityGridRepository extends JpaRepository<UtilityGrid, Long> {

    Optional<UtilityGrid> findByGridCode(String gridCode);

    List<UtilityGrid> findByGridType(GridType gridType);

    List<UtilityGrid> findByStatus(GridStatus status);

}