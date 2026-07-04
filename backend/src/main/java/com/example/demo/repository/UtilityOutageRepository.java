package com.example.demo.repository;

import com.example.demo.entity.UtilityOutage;
import com.example.demo.enums.OutageStatus;
import com.example.demo.enums.OutageType;
import com.example.demo.enums.Severity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UtilityOutageRepository extends JpaRepository<UtilityOutage, Long> {

    List<UtilityOutage> findByStatus(OutageStatus status);

    List<UtilityOutage> findBySeverity(Severity severity);

    List<UtilityOutage> findByOutageType(OutageType outageType);

    List<UtilityOutage> findByUtilityGridGridId(Long gridId);

    long countByStatus(OutageStatus status);
}