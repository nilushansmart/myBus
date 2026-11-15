package me.nilushan.mybus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillingSummaryResponse {
    private BigDecimal totalRevenue;
    private long totalBookings;
    private long confirmedBookings;
    private long cancelledBookings;
    private long totalBuses;
    private long totalTrips;
    private long totalPassengers;
    private List<BookingResponse> recentTransactions;
}
