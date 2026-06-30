package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "city_users")
public class CityUser {
    @Id
    private long userId;
    private String username ; 
    private String passwordHash ;
    private 
}
