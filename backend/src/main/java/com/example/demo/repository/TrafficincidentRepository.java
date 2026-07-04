package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.TrafficIncident;

public interface TrafficincidentRepository extends JpaRepository<TrafficIncident , Long> {

     
}
