package me.nilushan.mybus.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import me.nilushan.mybus.entity.enums.UserRole;

@Data
public class StaffRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    private String password;

    private UserRole role = UserRole.ROLE_STAFF;
}
