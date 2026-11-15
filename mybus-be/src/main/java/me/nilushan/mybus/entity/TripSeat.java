package me.nilushan.mybus.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import me.nilushan.mybus.entity.enums.SeatReservationStatus;
import java.time.LocalDateTime;

@Entity
@Table(name = "trip_seats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"trip_id", "seat_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trip_seat_id")
    private Long tripSeatId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    @JsonIgnoreProperties("tripSeats")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Trip trip;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private SeatReservationStatus status = SeatReservationStatus.available;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locked_by_user_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User lockedByUser;

    @PrePersist
    public void prePersist() {
        if (status == null) status = SeatReservationStatus.available;
    }
}
