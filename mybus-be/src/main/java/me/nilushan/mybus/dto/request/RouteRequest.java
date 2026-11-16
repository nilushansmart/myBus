package me.nilushan.mybus.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteRequest {
    @NotNull(message = "Origin station ID is required")
    private Long originStationId;

    @NotNull(message = "Destination station ID is required")
    private Long destinationStationId;

    @NotNull(message = "Estimated duration in minutes is required")
    @Min(value = 10, message = "Duration must be at least 10 minutes")
    private Integer estimatedDurationMinutes;

    @NotNull(message = "Total distance in km is required")
    @Min(value = 1, message = "Distance must be at least 1 km")
    private Double totalDistanceKm;

    private String routeNumber;
}
