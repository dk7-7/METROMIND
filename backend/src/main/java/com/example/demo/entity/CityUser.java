package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Table(name = "city_users")
/**
 * 
*/
@Entity
@Data
public class CityUser {
    @Id
    private long userId;
    @Column(unique = true,nullable = false)
    private String username ; 
    @Column(nullable = false)
    private String passwordHash;
    private String 
}
