package me.nilushan.mybus.dto.request;

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
public class SeatLockRequest {
    @NotNull(message = "Trip ID is required")
    private Long tripId;

    @NotEmpty(message = "At least one seat ID must be provided")
    private List<Long> seatIds;
}
