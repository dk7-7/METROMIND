package com.example.demo.repository;

import com.example.demo.entity.FieldObservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FieldObservationRepository extends JpaRepository<FieldObservation, Long> {
List<FieldObservation> findByIncident_IncidentId(Long incidentId);
List<FieldObservation> findByOutage_OutageId(Long outageId);
}