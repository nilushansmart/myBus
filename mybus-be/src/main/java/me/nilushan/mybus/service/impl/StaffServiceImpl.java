package me.nilushan.mybus.service.impl;

import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.request.CheckInRequest;
import me.nilushan.mybus.dto.response.TicketResponse;
import me.nilushan.mybus.dto.response.TripDetailResponse;
import me.nilushan.mybus.entity.Ticket;
import me.nilushan.mybus.entity.Trip;
import me.nilushan.mybus.entity.enums.TripStatus;
import me.nilushan.mybus.exception.ResourceNotFoundException;
import me.nilushan.mybus.mapper.TicketMapper;
import me.nilushan.mybus.repository.TicketRepository;
import me.nilushan.mybus.repository.TripRepository;
import me.nilushan.mybus.service.StaffService;
import me.nilushan.mybus.service.TripService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final TicketRepository ticketRepository;
    private final TripRepository tripRepository;
    private final TripService tripService;
    private final TicketMapper ticketMapper;

    @Override
    public List<TripDetailResponse> getUpcomingTrips() {
        List<Trip> upcoming = tripRepository
                .findByDepartureTimeAfterOrderByDepartureTimeAsc(LocalDateTime.now().minusHours(4));
        if (upcoming.isEmpty()) {
            return tripRepository.findAll().stream()
                    .filter(t -> t.getStatus() == TripStatus.scheduled || t.getStatus() == TripStatus.delayed)
                    .map(tripService::mapToTripDetail)
                    .collect(Collectors.toList());
        }
        return upcoming.stream()
                .filter(t -> t.getStatus() == TripStatus.scheduled || t.getStatus() == TripStatus.delayed)
                .map(tripService::mapToTripDetail)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketResponse> getTripManifest(Long tripId) {
        return ticketRepository.findByTripId(tripId).stream()
                .map(ticketMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketResponse> searchTickets(Long tripId, String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getTripManifest(tripId);
        }
        return ticketRepository.searchTicketsForTrip(tripId, keyword.trim()).stream()
                .map(ticketMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TicketResponse checkInTicket(CheckInRequest request) {
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + request.getTicketId()));

        boolean status = request.getIsCheckedIn() != null ? request.getIsCheckedIn() : true;
        ticket.setIsCheckedIn(status);
        ticket.setCheckedInAt(status ? LocalDateTime.now() : null);

        Ticket saved = ticketRepository.save(ticket);
        return ticketMapper.toResponse(saved);
    }

    @Override
    public List<TicketResponse> findTicketsByBookingRef(String bookingRef) {
        return ticketRepository.findByBookingReference(bookingRef).stream()
                .map(ticketMapper::toResponse)
                .collect(Collectors.toList());
    }
}
