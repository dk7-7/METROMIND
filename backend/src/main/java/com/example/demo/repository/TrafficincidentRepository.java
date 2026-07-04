package com.example.demo.repository;

import com.example.demo.entity.TrafficIncident;
import com.example.demo.enums.IncidentStatus;
import com.example.demo.enums.IncidentType;
import com.example.demo.enums.Severity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrafficIncidentRepository extends JpaRepository<TrafficIncident, Long> {

    List<TrafficIncident> findByStatus(IncidentStatus status);

    List<TrafficIncident> findBySeverity(Severity severity);

    List<TrafficIncident> findByIncidentType(IncidentType incidentType);

    List<TrafficIncident> findByTrafficZoneZoneId(Long zoneId);

    long countByStatus(IncidentStatus status);
}