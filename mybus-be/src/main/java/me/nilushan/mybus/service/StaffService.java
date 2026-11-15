package me.nilushan.mybus.service;

import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.CheckInRequest;
import me.nilushan.mybus.dto.TicketResponse;
import me.nilushan.mybus.dto.TripDetailResponse;
import me.nilushan.mybus.entity.Ticket;
import me.nilushan.mybus.entity.User;
import me.nilushan.mybus.repo.TicketRepository;
import me.nilushan.mybus.repo.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final TicketRepository ticketRepository;
    private final TripRepository tripRepository;
    private final TripService tripService;

    public List<TripDetailResponse> getUpcomingTrips() {
        return tripRepository.findByDepartureTimeAfterOrderByDepartureTimeAsc(LocalDateTime.now().minusHours(4)).stream()
                .map(tripService::mapToTripDetail)
                .collect(Collectors.toList());
    }

    public List<TicketResponse> getTripManifest(Long tripId) {
        return ticketRepository.findByTripId(tripId).stream()
                .map(this::mapToTicketResponse)
                .collect(Collectors.toList());
    }

    public List<TicketResponse> searchTickets(Long tripId, String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getTripManifest(tripId);
        }
        return ticketRepository.searchTicketsForTrip(tripId, keyword.trim()).stream()
                .map(this::mapToTicketResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TicketResponse checkInTicket(CheckInRequest request) {
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + request.getTicketId()));

        boolean status = request.getIsCheckedIn() != null ? request.getIsCheckedIn() : true;
        ticket.setIsCheckedIn(status);
        ticket.setCheckedInAt(status ? LocalDateTime.now() : null);

        Ticket saved = ticketRepository.save(ticket);
        return mapToTicketResponse(saved);
    }

    public List<TicketResponse> findTicketsByBookingRef(String bookingRef) {
        return ticketRepository.findByBookingReference(bookingRef).stream()
                .map(this::mapToTicketResponse)
                .collect(Collectors.toList());
    }

    private TicketResponse mapToTicketResponse(Ticket t) {
        return TicketResponse.builder()
                .ticketId(t.getTicketId())
                .tripSeatId(t.getTripSeat().getTripSeatId())
                .seatNumber(t.getTripSeat().getSeat().getSeatNumber())
                .deck(t.getTripSeat().getSeat().getDeck())
                .seatType(t.getTripSeat().getSeat().getSeatType())
                .passengerName(t.getPassengerName())
                .passengerAge(t.getPassengerAge())
                .passengerGender(t.getPassengerGender())
                .boardingStationName(t.getBoardingStation() != null ? t.getBoardingStation().getStationName() : "")
                .droppingStationName(t.getDroppingStation() != null ? t.getDroppingStation().getStationName() : "")
                .fareAmount(t.getFareAmount())
                .isCheckedIn(t.getIsCheckedIn())
                .checkedInAt(t.getCheckedInAt())
                .build();
    }
}
