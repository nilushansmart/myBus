package me.nilushan.mybus.mapper;

import me.nilushan.mybus.dto.response.StaffProfileResponse;
import me.nilushan.mybus.entity.StaffProfile;
import me.nilushan.mybus.entity.User;
import org.springframework.stereotype.Component;

@Component
public class StaffMapper {

    public StaffProfileResponse toResponse(StaffProfile profile) {
        if (profile == null) return null;

        User user = profile.getUser();
        return StaffProfileResponse.builder()
                .staffProfileId(profile.getStaffProfileId())
                .userId(user != null ? user.getUserId() : null)
                .fullName(user != null ? user.getFullName() : "")
                .email(user != null ? user.getEmail() : "")
                .phoneNumber(user != null ? user.getPhoneNumber() : "")
                .role(user != null ? user.getRoleType() : null)
                .operatorId(profile.getOperator() != null ? profile.getOperator().getOperatorId() : null)
                .operatorName(profile.getOperator() != null ? profile.getOperator().getOperatorName() : "")
                .staffTypeName(profile.getStaffType() != null ? profile.getStaffType().getName() : "")
                .employeeCode(profile.getEmployeeCode())
                .licenseNumber(profile.getLicenseNumber())
                .isActive(profile.getIsActive())
                .joinedAt(profile.getJoinedAt())
                .build();
    }
}
