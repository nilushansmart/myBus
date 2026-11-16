package me.nilushan.mybus.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.nilushan.mybus.entity.enums.BusType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusRequest {
    @NotNull(message = "Operator ID is required")
    private Long operatorId;

    @NotBlank(message = "Registration number is required")
    private String registrationNumber;

    @NotNull(message = "Bus class is required")
    private BusType busClass;

    @NotNull(message = "Total capacity is required")
    @Min(value = 10, message = "Capacity must be at least 10")
    private Integer totalCapacity;

    private Long layoutId;
    private Boolean isActive;
}
