package me.nilushan.mybus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import me.nilushan.mybus.entity.enums.GenderType;

@Data
public class PassengerInfoRequest {
    @NotNull(message = "Seat ID is required")
    private Long seatId;

    @NotBlank(message = "Passenger name is required")
    private String passengerName;

    @NotNull(message = "Passenger age is required")
    private Integer passengerAge;

    @NotNull(message = "Passenger gender is required")
    private GenderType passengerGender;

    private Long boardingStationId;
    private Long droppingStationId;
}
