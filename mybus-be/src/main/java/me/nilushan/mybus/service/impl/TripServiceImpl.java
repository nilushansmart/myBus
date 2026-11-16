package me.nilushan.mybus.service.impl;

import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.request.TripRequest;
import me.nilushan.mybus.dto.response.TripDetailResponse;
import me.nilushan.mybus.entity.*;
import me.nilushan.mybus.entity.enums.SeatReservationStatus;
import me.nilushan.mybus.entity.enums.TripStatus;
import me.nilushan.mybus.exception.BadRequestException;
import me.nilushan.mybus.exception.ResourceNotFoundException;
import me.nilushan.mybus.mapper.TripMapper;
import me.nilushan.mybus.repository.*;
import me.nilushan.mybus.service.TripService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final BusRepository busRepository;
    private final RouteRepository routeRepository;
    private final LayoutSeatRepository layoutSeatRepository;
    private final TripSeatRepository tripSeatRepository;
    private final SeatLockRepository seatLockRepository;
    private final TicketRepository ticketRepository;
    private final TripMapper tripMapper;

    @Override
    public List<TripDetailResponse> getAllTrips() {
        return tripRepository.findAll().stream()
                .map(this::mapToTripDetail)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<TripDetailResponse> searchTrips(String originCity, String destinationCity, String dateStr) {
        releaseExpiredLocks();

        if (originCity != null && destinationCity != null && dateStr != null && !dateStr.isBlank()) {
            LocalDate date = LocalDate.parse(dateStr);

            return tripRepository.findAll().stream()
                    .filter(t -> t.getStatus() == TripStatus.scheduled || t.getStatus() == TripStatus.delayed)
                    .filter(t -> (t.getRoute().getOriginStation() != null &&
                            (t.getRoute().getOriginStation().getCity().equalsIgnoreCase(originCity) ||
                             t.getRoute().getOriginStation().getStationName().toLowerCase().contains(originCity.toLowerCase()))))
                    .filter(t -> (t.getRoute().getDestinationStation() != null &&
                            (t.getRoute().getDestinationStation().getCity().equalsIgnoreCase(destinationCity) ||
                             t.getRoute().getDestinationStation().getStationName().toLowerCase().contains(destinationCity.toLowerCase()))))
                    .filter(t -> t.getDepartureTime().toLocalDate().isEqual(date))
                    .map(this::mapToTripDetail)
                    .collect(Collectors.toList());
        }

        // Return scheduled trips from current time onwards (or fallback to scheduled trips if testing past seed dates)
        List<Trip> upcoming = tripRepository.findByDepartureTimeAfterOrderByDepartureTimeAsc(LocalDateTime.now().minusHours(2));
        if (upcoming.isEmpty()) {
            return tripRepository.findAll().stream()
                    .filter(t -> t.getStatus() == TripStatus.scheduled || t.getStatus() == TripStatus.delayed)
                    .map(this::mapToTripDetail)
                    .collect(Collectors.toList());
        }
        return upcoming.stream()
                .filter(t -> t.getStatus() == TripStatus.scheduled || t.getStatus() == TripStatus.delayed)
                .map(this::mapToTripDetail)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TripDetailResponse getTripDetailsWithSeats(Long tripId) {
        releaseExpiredLocks();
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));
        return mapToTripDetail(trip);
    }

    @Override
    @Transactional
    public Trip createTrip(TripRequest request) {
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found: " + request.getBusId()));
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found: " + request.getRouteId()));

        Trip trip = Trip.builder()
                .bus(bus)
                .route(route)
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .baseFare(request.getBaseFare())
                .status(request.getStatus() != null ? request.getStatus() : TripStatus.scheduled)
                .build();

        Trip savedTrip = tripRepository.save(trip);

        // Generate TripSeat records for every physical seat on the bus layout
        if (bus.getSeatLayout() != null) {
            List<LayoutSeat> layoutSeats = layoutSeatRepository.findBySeatLayoutLayoutIdOrderByDeckAscRowIndexAscColIndexAsc(bus.getSeatLayout().getLayoutId());
            List<TripSeat> tripSeats = new ArrayList<>();
            for (LayoutSeat seat : layoutSeats) {
                tripSeats.add(TripSeat.builder()
                        .trip(savedTrip)
                        .layoutSeat(seat)
                        .status(SeatReservationStatus.available)
                        .build());
            }
            tripSeatRepository.saveAll(tripSeats);
        }

        return savedTrip;
    }

    @Override
    @Transactional
    public Trip updateTrip(Long tripId, TripRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found: " + tripId));
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found: " + request.getBusId()));
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found: " + request.getRouteId()));

        trip.setBus(bus);
        trip.setRoute(route);
        trip.setDepartureTime(request.getDepartureTime());
        trip.setArrivalTime(request.getArrivalTime());
        trip.setBaseFare(request.getBaseFare());
        if (request.getStatus() != null) {
            trip.setStatus(request.getStatus());
        }

        return tripRepository.save(trip);
    }

    @Override
    @Transactional
    public void deleteTrip(Long tripId) {
        if (!tripRepository.existsById(tripId)) {
            throw new ResourceNotFoundException("Trip not found: " + tripId);
        }
        if (ticketRepository.existsByTripId(tripId)) {
            throw new BadRequestException("Cannot delete trip because active passenger bookings exist. Please cancel the trip status instead.");
        }
        List<TripSeat> tripSeats = tripSeatRepository.findSeatsByTripId(tripId);
        List<Long> tripSeatIds = tripSeats.stream().map(TripSeat::getTripSeatId).collect(Collectors.toList());
        if (!tripSeatIds.isEmpty()) {
            seatLockRepository.deleteByTripSeatIds(tripSeatIds);
        }
        tripSeatRepository.deleteByTripId(tripId);
        tripRepository.deleteById(tripId);
    }

    @Override
    @Transactional
    public Trip updateTripStatus(Long tripId, TripStatus status) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found: " + tripId));
        trip.setStatus(status);
        return tripRepository.save(trip);
    }

    @Override
    public TripDetailResponse mapToTripDetail(Trip trip) {
        List<TripSeat> tripSeats = tripSeatRepository.findSeatsByTripId(trip.getTripId());
        return tripMapper.toDetailResponse(trip, tripSeats);
    }

    private void releaseExpiredLocks() {
        seatLockRepository.deleteExpiredLocks(LocalDateTime.now());
        List<TripSeat> seats = tripSeatRepository.findAll();
        for (TripSeat ts : seats) {
            if (ts.getStatus() == SeatReservationStatus.locked && (ts.getSeatLock() == null || ts.getSeatLock().getLockedUntil().isBefore(LocalDateTime.now()))) {
                ts.setStatus(SeatReservationStatus.available);
                tripSeatRepository.save(ts);
            }
        }
    }
}
