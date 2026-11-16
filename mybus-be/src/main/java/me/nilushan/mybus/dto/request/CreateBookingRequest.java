package me.nilushan.mybus.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBookingRequest {
    @NotNull(message = "Trip ID is required")
    private Long tripId;

    @NotEmpty(message = "At least one passenger must be selected")
    @Valid
    private List<PassengerInfoRequest> passengers;

    private String paymentMethod;
}
