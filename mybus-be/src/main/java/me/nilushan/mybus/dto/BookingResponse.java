package me.nilushan.mybus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.nilushan.mybus.entity.enums.BookingStatusType;
import me.nilushan.mybus.entity.enums.BusType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Long bookingId;
    private String bookingReference;
    private BookingStatusType bookingStatus;
    private BigDecimal totalAmount;
    private LocalDateTime bookedAt;
    
    // User info
    private String userId;
    private String userFullName;
    private String userEmail;
    private String userPhone;

    // Trip info
    private Long tripId;
    private String busRegistrationNumber;
    private BusType busClass;
    private String operatorName;
    private String originCity;
    private String originStationName;
    private String destinationCity;
    private String destinationStationName;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;

    // Tickets
    private List<TicketResponse> tickets;

    // Payment info
    private String transactionReference;
    private String paymentStatus;
}
