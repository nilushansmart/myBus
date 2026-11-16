package me.nilushan.mybus.service;

import me.nilushan.mybus.dto.request.StaffRequest;
import me.nilushan.mybus.dto.response.BillingSummaryResponse;
import me.nilushan.mybus.entity.User;

import java.util.List;

public interface BillingService {
    BillingSummaryResponse getBillingSummary();

    List<User> getAllStaff();

    User createStaff(StaffRequest request);

    User updateStaff(String userId, StaffRequest request);

    void deleteStaff(String userId);
}
