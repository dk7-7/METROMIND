package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.TrafficZone;

public interface TrafficZoneRepository extends JpaRepository<TrafficZone,Long> {

     
}