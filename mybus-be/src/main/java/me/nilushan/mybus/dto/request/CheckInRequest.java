package me.nilushan.mybus.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckInRequest {
    @NotNull(message = "Ticket ID is required")
    private Long ticketId;

    private Boolean isCheckedIn;
}
