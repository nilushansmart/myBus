package me.nilushan.mybus.service;

import me.nilushan.mybus.dto.request.TripRequest;
import me.nilushan.mybus.dto.response.TripDetailResponse;
import me.nilushan.mybus.entity.Trip;
import me.nilushan.mybus.entity.enums.TripStatus;

import java.util.List;

public interface TripService {
    List<TripDetailResponse> getAllTrips();

    List<TripDetailResponse> searchTrips(String originCity, String destinationCity, String dateStr);

    TripDetailResponse getTripDetailsWithSeats(Long tripId);

    Trip createTrip(TripRequest request);

    Trip updateTrip(Long tripId, TripRequest request);

    void deleteTrip(Long tripId);

    Trip updateTripStatus(Long tripId, TripStatus status);

    TripDetailResponse mapToTripDetail(Trip trip);
}
