package me.nilushan.mybus.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateBookingRequest {
    @NotNull(message = "Trip ID is required")
    private Long tripId;

    @NotEmpty(message = "Passenger details are required")
    private List<PassengerInfoRequest> passengers;

    private String paymentMethod;
}
