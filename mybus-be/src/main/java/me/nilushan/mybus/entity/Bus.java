package me.nilushan.mybus.entity;

import jakarta.persistence.*;
import lombok.*;
import me.nilushan.mybus.entity.enums.BusType;

import java.time.LocalDateTime;

@Entity
@Table(name = "buses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bus_id")
    private Long busId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "operator_id", nullable = false)
    private BusOperator operator;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bus_class_id")
    private BusClass busClassEntity;

    @Enumerated(EnumType.STRING)
    @Column(name = "bus_class")
    @Builder.Default
    private BusType busClass = BusType.AC_Seater;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seat_layout_id")
    private SeatLayout seatLayout;

    @Column(name = "registration_number", nullable = false, unique = true, length = 30)
    private String registrationNumber;

    @Column(name = "total_capacity", nullable = false)
    private Integer totalCapacity;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (isActive == null) isActive = true;
        if (busClass == null) busClass = BusType.AC_Seater;
    }
}
