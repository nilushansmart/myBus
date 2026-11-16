package me.nilushan.mybus.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import me.nilushan.mybus.entity.enums.SeatReservationStatus;

import java.math.BigDecimal;

@Entity
@Table(name = "trip_seats", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "trip_id", "layout_seat_id" })
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
    @JoinColumn(name = "layout_seat_id", nullable = false)
    private LayoutSeat layoutSeat;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private SeatReservationStatus status = SeatReservationStatus.available;

    @Column(name = "fare_override", precision = 10, scale = 2)
    private BigDecimal fareOverride;

    @OneToOne(mappedBy = "tripSeat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("tripSeat")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private SeatLock seatLock;

    @PrePersist
    public void prePersist() {
        if (status == null)
            status = SeatReservationStatus.available;
    }
}
