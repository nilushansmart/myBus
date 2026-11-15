package me.nilushan.mybus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.nilushan.mybus.entity.enums.BusType;
import me.nilushan.mybus.entity.enums.TripStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripDetailResponse {
    private Long tripId;
    private Long busId;
    private String registrationNumber;
    private BusType busClass;
    private String operatorName;
    private Long routeId;
    private String originCity;
    private String originStationName;
    private String destinationCity;
    private String destinationStationName;
    private Integer estimatedDurationMinutes;
    private Double totalDistanceKm;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private BigDecimal baseFare;
    private TripStatus status;
    private int totalSeats;
    private int availableSeats;
    private List<SeatDto> seats;
}
