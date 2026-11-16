package me.nilushan.mybus.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import me.nilushan.mybus.entity.enums.GenderType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id")
    private Long ticketId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    @JsonIgnoreProperties("tickets")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Booking booking;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "trip_seat_id", nullable = false)
    private TripSeat tripSeat;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "boarding_stop_id")
    private RouteStop boardingStop;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dropping_stop_id")
    private RouteStop droppingStop;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "boarding_station_id")
    private Station boardingStation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dropping_station_id")
    private Station droppingStation;

    @Column(name = "passenger_name", nullable = false)
    private String passengerName;

    @Column(name = "passenger_age", nullable = false)
    private Integer passengerAge;

    @Enumerated(EnumType.STRING)
    @Column(name = "passenger_gender", nullable = false)
    private GenderType passengerGender;

    @Column(name = "fare_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal fareAmount;

    @Column(name = "is_checked_in", nullable = false)
    @Builder.Default
    private Boolean isCheckedIn = false;

    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;

    @PrePersist
    public void prePersist() {
        if (isCheckedIn == null) isCheckedIn = false;
        if (boardingStation == null && boardingStop != null) {
            boardingStation = boardingStop.getStation();
        }
        if (droppingStation == null && droppingStop != null) {
            droppingStation = droppingStop.getStation();
        }
    }
}
