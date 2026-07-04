package com.example.demo.config;

import com.example.demo.entity.*;
import com.example.demo.enums.*;
import com.example.demo.repository.CityUserRepository;
import com.example.demo.repository.TrafficZoneRepository;
import com.example.demo.repository.UtilityGridRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CityUserRepository cityUserRepository;
    private final TrafficZoneRepository trafficZoneRepository;
    private final UtilityGridRepository utilityGridRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (cityUserRepository.findByUsername("admin").isEmpty()) {
            CityUser admin = CityUser.builder()
                    .username("admin")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .fullName("Administrator Admin")
                    .role(Role.CITY_ADMINISTRATOR)
                    .district("Central")
                    .badgeNumber("ADMIN-001")
                    .isActive(true)
                    .build();
            cityUserRepository.save(admin);
        }

        if (trafficZoneRepository.count() == 0) {
            trafficZoneRepository.save(TrafficZone.builder()
                    .zoneName("Downtown Hub")
                    .zoneCode("DT-01")
                    .district("Central")
                    .currentCongestionLevel(CongestionLevel.HIGH)
                    .signalCycleSeconds(90)
                    .build());

            trafficZoneRepository.save(TrafficZone.builder()
                    .zoneName("Industrial Way")
                    .zoneCode("IW-05")
                    .district("North")
                    .currentCongestionLevel(CongestionLevel.LOW)
                    .signalCycleSeconds(120)
                    .build());
        }

        if (utilityGridRepository.count() == 0) {
            utilityGridRepository.save(UtilityGrid.builder()
                    .gridName("Main Power Station")
                    .gridType(GridType.POWER)
                    .district("Central")
                    .capacityUnits(500.0)
                    .currentLoad(350.0)
                    .status(GridStatus.OPERATIONAL)
                    .build());

            utilityGridRepository.save(UtilityGrid.builder()
                    .gridName("East Water Treatment")
                    .gridType(GridType.WATER)
                    .district("East")
                    .capacityUnits(300.0)
                    .currentLoad(280.0)
                    .status(GridStatus.DEGRADED)
                    .build());
        }
    }
}