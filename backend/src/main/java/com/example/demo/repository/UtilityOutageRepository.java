package com.example.demo.repository;

import com.example.demo.enums.OutageStatus;
import com.example.demo.entity.UtilityOutage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UtilityOutageRepository extends JpaRepository<UtilityOutage, Long> {
List<UtilityOutage> findByStatus(OutageStatus status);
List<UtilityOutage> findByGrid_GridId(Long gridId);
}