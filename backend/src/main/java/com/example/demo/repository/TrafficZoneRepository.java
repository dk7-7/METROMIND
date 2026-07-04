package com.example.demo.repository;

import com.example.demo.enums.CongestionLevel;
import com.example.demo.entity.TrafficZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TrafficZoneRepository extends JpaRepository<TrafficZone, Long> {

List<TrafficZone> findByDistrict(String district);

@Query("SELECT z FROM TrafficZone z WHERE z.currentCongestionLevel = 'HIGH' OR z.currentCongestionLevel = 'CRITICAL'")
List<TrafficZone> findHighlyCongestedZones();

@Query("SELECT z FROM TrafficZone z WHERE z.currentCongestionLevel = :level")
List<TrafficZone> findByCongestionLevel(@Param("level") CongestionLevel level);
}