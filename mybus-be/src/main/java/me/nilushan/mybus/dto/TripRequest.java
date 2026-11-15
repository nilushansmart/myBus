package me.nilushan.mybus.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import me.nilushan.mybus.entity.enums.TripStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TripRequest {
    @NotNull(message = "Bus ID is required")
    private Long busId;

    @NotNull(message = "Route ID is required")
    private Long routeId;

    @NotNull(message = "Departure time is required")
    private LocalDateTime departureTime;

    @NotNull(message = "Arrival time is required")
    private LocalDateTime arrivalTime;

    @NotNull(message = "Base fare is required")
    private BigDecimal baseFare;

    private TripStatus status = TripStatus.scheduled;
}
