package me.nilushan.mybus.service;

import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.SeatDto;
import me.nilushan.mybus.dto.TripDetailResponse;
import me.nilushan.mybus.dto.TripRequest;
import me.nilushan.mybus.entity.*;
import me.nilushan.mybus.entity.enums.SeatReservationStatus;
import me.nilushan.mybus.entity.enums.TripStatus;
import me.nilushan.mybus.repo.*;
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
public class TripService {

    private final TripRepository tripRepository;
    private final BusRepository busRepository;
    private final RouteRepository routeRepository;
    private final SeatRepository seatRepository;
    private final TripSeatRepository tripSeatRepository;
    private final TicketRepository ticketRepository;

    public List<TripDetailResponse> getAllTrips() {
        return tripRepository.findAll().stream()
                .map(this::mapToTripDetail)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<TripDetailResponse> searchTrips(String originCity, String destinationCity, String dateStr) {
        tripSeatRepository.releaseExpiredLocks(LocalDateTime.now());

        if (originCity != null && destinationCity != null && dateStr != null && !dateStr.isBlank()) {
            LocalDate date = LocalDate.parse(dateStr);
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.atTime(LocalTime.MAX);

            return tripRepository.findAll().stream()
                    .filter(t -> t.getStatus() == TripStatus.scheduled || t.getStatus() == TripStatus.delayed)
                    .filter(t -> t.getRoute().getOriginStation().getCity().equalsIgnoreCase(originCity) ||
                                 t.getRoute().getOriginStation().getStationName().toLowerCase().contains(originCity.toLowerCase()))
                    .filter(t -> t.getRoute().getDestinationStation().getCity().equalsIgnoreCase(destinationCity) ||
                                 t.getRoute().getDestinationStation().getStationName().toLowerCase().contains(destinationCity.toLowerCase()))
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

    @Transactional
    public TripDetailResponse getTripDetailsWithSeats(Long tripId) {
        tripSeatRepository.releaseExpiredLocks(LocalDateTime.now());
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found with id: " + tripId));
        return mapToTripDetail(trip);
    }

    @Transactional
    public Trip createTrip(TripRequest request) {
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new RuntimeException("Bus not found: " + request.getBusId()));
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found: " + request.getRouteId()));

        Trip trip = Trip.builder()
                .bus(bus)
                .route(route)
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .baseFare(request.getBaseFare())
                .status(request.getStatus() != null ? request.getStatus() : TripStatus.scheduled)
                .build();

        Trip savedTrip = tripRepository.save(trip);

        // Generate TripSeat records for every physical seat on the bus
        List<Seat> busSeats = seatRepository.findByBusBusIdOrderByDeckAscRowIndexAscColIndexAsc(bus.getBusId());
        List<TripSeat> tripSeats = new ArrayList<>();
        for (Seat seat : busSeats) {
            tripSeats.add(TripSeat.builder()
                    .trip(savedTrip)
                    .seat(seat)
                    .status(SeatReservationStatus.available)
                    .build());
        }
        tripSeatRepository.saveAll(tripSeats);

        return savedTrip;
    }

    @Transactional
    public Trip updateTrip(Long tripId, TripRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found: " + tripId));
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new RuntimeException("Bus not found: " + request.getBusId()));
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found: " + request.getRouteId()));

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

    @Transactional
    public void deleteTrip(Long tripId) {
        if (!tripRepository.existsById(tripId)) {
            throw new RuntimeException("Trip not found: " + tripId);
        }
        if (ticketRepository.existsByTripId(tripId)) {
            throw new RuntimeException("Cannot delete trip because active passenger bookings exist. Please cancel the trip status instead.");
        }
        tripSeatRepository.deleteByTripId(tripId);
        tripRepository.deleteById(tripId);
    }

    @Transactional
    public Trip updateTripStatus(Long tripId, TripStatus status) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found: " + tripId));
        trip.setStatus(status);
        return tripRepository.save(trip);
    }

    public TripDetailResponse mapToTripDetail(Trip trip) {
        List<TripSeat> tripSeats = tripSeatRepository.findSeatsByTripId(trip.getTripId());

        long availableCount = tripSeats.stream()
                .filter(ts -> ts.getStatus() == SeatReservationStatus.available)
                .count();

        List<SeatDto> seatDtos = tripSeats.stream()
                .map(ts -> SeatDto.builder()
                        .tripSeatId(ts.getTripSeatId())
                        .seatId(ts.getSeat().getSeatId())
                        .seatNumber(ts.getSeat().getSeatNumber())
                        .deck(ts.getSeat().getDeck())
                        .seatType(ts.getSeat().getSeatType())
                        .rowIndex(ts.getSeat().getRowIndex())
                        .colIndex(ts.getSeat().getColIndex())
                        .status(ts.getStatus())
                        .lockedUntil(ts.getLockedUntil())
                        .lockedByUserId(ts.getLockedByUser() != null ? ts.getLockedByUser().getUserId() : null)
                        .build())
                .collect(Collectors.toList());

        return TripDetailResponse.builder()
                .tripId(trip.getTripId())
                .busId(trip.getBus().getBusId())
                .registrationNumber(trip.getBus().getRegistrationNumber())
                .busClass(trip.getBus().getBusClass())
                .operatorName(trip.getBus().getOperator().getOperatorName())
                .routeId(trip.getRoute().getRouteId())
                .originCity(trip.getRoute().getOriginStation().getCity())
                .originStationName(trip.getRoute().getOriginStation().getStationName())
                .destinationCity(trip.getRoute().getDestinationStation().getCity())
                .destinationStationName(trip.getRoute().getDestinationStation().getStationName())
                .estimatedDurationMinutes(trip.getRoute().getEstimatedDurationMinutes())
                .totalDistanceKm(trip.getRoute().getTotalDistanceKm())
                .departureTime(trip.getDepartureTime())
                .arrivalTime(trip.getArrivalTime())
                .baseFare(trip.getBaseFare())
                .status(trip.getStatus())
                .totalSeats(tripSeats.size())
                .availableSeats((int) availableCount)
                .seats(seatDtos)
                .build();
    }
}
