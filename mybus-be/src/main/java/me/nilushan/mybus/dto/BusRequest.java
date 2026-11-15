package me.nilushan.mybus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import me.nilushan.mybus.entity.enums.BusType;

@Data
public class BusRequest {
    @NotNull(message = "Operator ID is required")
    private Long operatorId;

    @NotBlank(message = "Registration number is required")
    private String registrationNumber;

    @NotNull(message = "Bus class is required")
    private BusType busClass;

    @NotNull(message = "Total capacity is required")
    private Integer totalCapacity;

    private Boolean isActive = true;
}
