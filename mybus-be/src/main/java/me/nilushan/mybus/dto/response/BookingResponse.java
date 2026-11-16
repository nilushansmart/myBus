package me.nilushan.mybus.dto.response;

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
    private String userId;
    private String userFullName;
    private String userEmail;
    private String userPhone;
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
    private List<TicketResponse> tickets;
    private String transactionReference;
    private String paymentStatus;
    private String invoiceNumber;
}
