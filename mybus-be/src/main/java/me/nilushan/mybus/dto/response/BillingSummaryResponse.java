package me.nilushan.mybus.dto.response;

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
    private Long totalBookings;
    private Long confirmedBookings;
    private Long cancelledBookings;
    private Long totalBuses;
    private Long totalTrips;
    private Long totalPassengers;
    private List<BookingResponse> recentTransactions;
}
