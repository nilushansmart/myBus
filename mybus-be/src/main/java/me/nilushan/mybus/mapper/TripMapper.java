package me.nilushan.mybus.mapper;

import me.nilushan.mybus.dto.response.SeatDto;
import me.nilushan.mybus.dto.response.TripDetailResponse;
import me.nilushan.mybus.entity.Trip;
import me.nilushan.mybus.entity.TripSeat;
import me.nilushan.mybus.entity.enums.SeatReservationStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TripMapper {

    public TripDetailResponse toDetailResponse(Trip trip, List<TripSeat> tripSeats) {
        if (trip == null) return null;

        long availableCount = tripSeats.stream()
                .filter(ts -> ts.getStatus() == SeatReservationStatus.available)
                .count();

        List<SeatDto> seatDtos = tripSeats.stream()
                .map(this::toSeatDto)
                .collect(Collectors.toList());

        return TripDetailResponse.builder()
                .tripId(trip.getTripId())
                .busId(trip.getBus().getBusId())
                .registrationNumber(trip.getBus().getRegistrationNumber())
                .busClass(trip.getBus().getBusClass())
                .operatorName(trip.getBus().getOperator().getOperatorName())
                .routeId(trip.getRoute().getRouteId())
                .routeNumber(trip.getRoute().getRouteNumber())
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

    public SeatDto toSeatDto(TripSeat ts) {
        if (ts == null) return null;

        String lockedByUserId = null;
        if (ts.getSeatLock() != null && ts.getSeatLock().getUser() != null) {
            lockedByUserId = ts.getSeatLock().getUser().getUserId();
        }

        return SeatDto.builder()
                .tripSeatId(ts.getTripSeatId())
                .seatId(ts.getLayoutSeat().getLayoutSeatId())
                .seatNumber(ts.getLayoutSeat().getSeatNumber())
                .deck(ts.getLayoutSeat().getDeck())
                .seatType(ts.getLayoutSeat().getSeatCategory())
                .rowIndex(ts.getLayoutSeat().getRowIndex())
                .colIndex(ts.getLayoutSeat().getColIndex())
                .status(ts.getStatus())
                .lockedUntil(ts.getSeatLock() != null ? ts.getSeatLock().getLockedUntil() : null)
                .lockedByUserId(lockedByUserId)
                .build();
    }
}
