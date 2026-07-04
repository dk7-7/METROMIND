package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.example.demo.enums.Severity;

@Entity
@Table(name = "alert_notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alertId;

    @Enumerated(EnumType.STRING)
    private Role targetRole;

    @Column(nullable = false, length = 500)
    private String message;

    private String relatedEntityType;

    private Long relatedEntityId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    @Builder.Default
    private boolean isRead = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private CityUser user;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}