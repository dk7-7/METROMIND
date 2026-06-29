package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.CityUser;

public interface CityUserRepository extends JpaRepository<CityUser,Long>{

}
