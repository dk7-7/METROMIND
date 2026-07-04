package com.example.demo.repository;

import com.example.demo.entity.TrafficZone;
import com.example.demo.enums.CongestionLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TrafficZoneRepository extends JpaRepository<TrafficZone, Long> {

    Optional<TrafficZone> findByZoneCode(String zoneCode);

    List<TrafficZone> findByDistrict(String district);

    List<TrafficZone> findByCurrentCongestionLevel(CongestionLevel level);

}   