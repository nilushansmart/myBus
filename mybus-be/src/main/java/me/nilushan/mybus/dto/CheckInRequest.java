package me.nilushan.mybus.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckInRequest {
    @NotNull(message = "Ticket ID is required")
    private Long ticketId;

    private Boolean isCheckedIn = true;
}
