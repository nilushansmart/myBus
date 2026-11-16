package me.nilushan.mybus.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "staff_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "staff_profile_id")
    private Long staffProfileId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "operator_id", nullable = false)
    private BusOperator operator;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "staff_type_id", nullable = false)
    private StaffType staffType;

    @Column(name = "employee_code", unique = true, length = 30)
    private String employeeCode;

    @Column(name = "license_number")
    private String licenseNumber;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    @PrePersist
    public void prePersist() {
        if (joinedAt == null) joinedAt = LocalDateTime.now();
        if (isActive == null) isActive = true;
    }
}
