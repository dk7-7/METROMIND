package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "city_users")
@NoArgsConstructor
@AllArgsConstructor
public class CityUser {
    @Id
    private long userId;
    
    private String username ; 
    private String passwordHash ;
}
