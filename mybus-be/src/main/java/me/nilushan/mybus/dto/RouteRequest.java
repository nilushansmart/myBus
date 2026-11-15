package me.nilushan.mybus.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RouteRequest {
    @NotNull(message = "Origin station ID is required")
    private Long originStationId;

    @NotNull(message = "Destination station ID is required")
    private Long destinationStationId;

    @NotNull(message = "Estimated duration in minutes is required")
    private Integer estimatedDurationMinutes;

    @NotNull(message = "Total distance is required")
    private Double totalDistanceKm;
}
