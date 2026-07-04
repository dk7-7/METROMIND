package com.example.demo.repository;

import com.example.demo.entity.TrafficIncident;
import com.example.demo.enums.IncidentStatus;
import com.example.demo.enums.Severity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrafficIncidentRepository extends JpaRepository<TrafficIncident, Long> {

    List<TrafficIncident> findByStatus(IncidentStatus status);

    List<TrafficIncident> findBySeverity(Severity severity);

    List<TrafficIncident> findByZoneZoneId(Long zoneId);

    List<TrafficIncident> findByReportedByUserId(Long userId);

}