package me.nilushan.mybus.service;

import me.nilushan.mybus.dto.request.CheckInRequest;
import me.nilushan.mybus.dto.response.TicketResponse;
import me.nilushan.mybus.dto.response.TripDetailResponse;

import java.util.List;

public interface StaffService {
    List<TripDetailResponse> getUpcomingTrips();

    List<TicketResponse> getTripManifest(Long tripId);

    List<TicketResponse> searchTickets(Long tripId, String keyword);

    TicketResponse checkInTicket(CheckInRequest request);

    List<TicketResponse> findTicketsByBookingRef(String bookingRef);
}
