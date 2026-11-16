package me.nilushan.mybus.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.nilushan.mybus.entity.enums.GenderType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PassengerInfoRequest {
    @NotNull(message = "Seat ID is required")
    private Long seatId;

    @NotBlank(message = "Passenger name is required")
    private String passengerName;

    @NotNull(message = "Passenger age is required")
    @Min(value = 1, message = "Passenger age must be valid")
    private Integer passengerAge;

    @NotNull(message = "Passenger gender is required")
    private GenderType passengerGender;

    private Long boardingStationId;
    private Long droppingStationId;
}
