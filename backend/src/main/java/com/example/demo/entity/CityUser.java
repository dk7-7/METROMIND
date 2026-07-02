package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "city_users")
/**
 * 
 */
@Data
public class CityUser {
    @Id
    private long userId;
    Private 
}
