package me.nilushan.mybus.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.nilushan.mybus.entity.enums.UserRole;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    private String password;
    private UserRole role;

    private Long operatorId;
    private Long staffTypeId;
    private String employeeCode;
    private String licenseNumber;
}
