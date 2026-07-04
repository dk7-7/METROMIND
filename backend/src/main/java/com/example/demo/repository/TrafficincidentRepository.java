package com.example.demo.repository;

import com.example.demo.entity.TrafficIncident;
import com.example.demo.enums.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrafficIncidentRepository extends JpaRepository<TrafficIncident, Long> {
 
    List<TrafficIncident> findByZone_ZoneIdAndStatusNotIn(
            Long zoneId,
            List<IncidentStatus> statuses
    );
 
    long countByStatusNotIn(List<IncidentStatus> statuses);
 
    @Query("""
           SELECT i.incidentType, COUNT(i)
           FROM Trafficincident i
           GROUP BY i.incidentType
           """)
    List<Object[]> countIncidentsByType();
}