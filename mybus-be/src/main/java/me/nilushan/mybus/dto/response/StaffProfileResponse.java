package me.nilushan.mybus.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.nilushan.mybus.entity.enums.UserRole;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffProfileResponse {
    private Long staffProfileId;
    private String userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private UserRole role;
    private Long operatorId;
    private String operatorName;
    private String staffTypeName;
    private String employeeCode;
    private String licenseNumber;
    private Boolean isActive;
    private LocalDateTime joinedAt;
}
