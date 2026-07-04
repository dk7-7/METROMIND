package com.example.demo.repository;

import com.example.demo.entity.CityUser;
import com.example.demo.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CityUserRepository extends JpaRepository<CityUser, Long> {

    Optional<CityUser> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByBadgeNumber(String badgeNumber);

    List<CityUser> findByRole(Role role);

    List<CityUser> findByDistrict(String district);

    List<CityUser> findByIsActiveTrue();
}