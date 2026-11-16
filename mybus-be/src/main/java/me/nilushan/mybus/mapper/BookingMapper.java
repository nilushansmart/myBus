package me.nilushan.mybus.mapper;

import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.response.BookingResponse;
import me.nilushan.mybus.dto.response.TicketResponse;
import me.nilushan.mybus.entity.Booking;
import me.nilushan.mybus.entity.Payment;
import me.nilushan.mybus.entity.Ticket;
import me.nilushan.mybus.entity.Trip;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class BookingMapper {

    private final TicketMapper ticketMapper;

    public BookingResponse toResponse(Booking booking, List<Ticket> tickets, Payment payment, Trip trip) {
        if (booking == null) return null;

        List<TicketResponse> ticketResponses = tickets.stream()
                .map(ticketMapper::toResponse)
                .collect(Collectors.toList());

        String invNum = booking.getInvoice() != null ? booking.getInvoice().getInvoiceNumber() : "";

        return BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .bookingReference(booking.getBookingReference())
                .bookingStatus(booking.getBookingStatus())
                .totalAmount(booking.getTotalAmount())
                .bookedAt(booking.getBookedAt())
                .userId(booking.getUser() != null ? booking.getUser().getUserId() : null)
                .userFullName(booking.getUser() != null ? booking.getUser().getFullName() : "")
                .userEmail(booking.getUser() != null ? booking.getUser().getEmail() : "")
                .userPhone(booking.getUser() != null ? booking.getUser().getPhoneNumber() : "")
                .tripId(trip != null ? trip.getTripId() : null)
                .busRegistrationNumber(trip != null && trip.getBus() != null ? trip.getBus().getRegistrationNumber() : "")
                .busClass(trip != null && trip.getBus() != null ? trip.getBus().getBusClass() : null)
                .operatorName(trip != null && trip.getBus() != null && trip.getBus().getOperator() != null ? trip.getBus().getOperator().getOperatorName() : "")
                .originCity(trip != null && trip.getRoute() != null && trip.getRoute().getOriginStation() != null ? trip.getRoute().getOriginStation().getCity() : "")
                .originStationName(trip != null && trip.getRoute() != null && trip.getRoute().getOriginStation() != null ? trip.getRoute().getOriginStation().getStationName() : "")
                .destinationCity(trip != null && trip.getRoute() != null && trip.getRoute().getDestinationStation() != null ? trip.getRoute().getDestinationStation().getCity() : "")
                .destinationStationName(trip != null && trip.getRoute() != null && trip.getRoute().getDestinationStation() != null ? trip.getRoute().getDestinationStation().getStationName() : "")
                .departureTime(trip != null ? trip.getDepartureTime() : null)
                .arrivalTime(trip != null ? trip.getArrivalTime() : null)
                .tickets(ticketResponses)
                .transactionReference(payment != null ? payment.getTransactionReference() : "")
                .paymentStatus(payment != null && payment.getPaymentStatus() != null ? payment.getPaymentStatus().name() : "")
                .invoiceNumber(invNum)
                .build();
    }
}
