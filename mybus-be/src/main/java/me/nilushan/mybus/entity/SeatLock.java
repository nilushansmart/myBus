package me.nilushan.mybus.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "seat_locks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatLock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lock_id")
    private Long lockId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_seat_id", nullable = false, unique = true)
    @JsonIgnoreProperties("seatLock")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private TripSeat tripSeat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @Column(name = "locked_until", nullable = false)
    private LocalDateTime lockedUntil;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (lockedUntil == null) lockedUntil = LocalDateTime.now().plusMinutes(10);
    }
}
