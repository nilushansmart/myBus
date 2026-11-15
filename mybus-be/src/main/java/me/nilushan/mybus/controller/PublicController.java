package me.nilushan.mybus.controller;

import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.ApiResponse;
import me.nilushan.mybus.dto.TripDetailResponse;
import me.nilushan.mybus.entity.Route;
import me.nilushan.mybus.entity.Station;
import me.nilushan.mybus.service.RouteService;
import me.nilushan.mybus.service.StationService;
import me.nilushan.mybus.service.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final StationService stationService;
    private final RouteService routeService;
    private final TripService tripService;

    @GetMapping("/stations")
    public ResponseEntity<ApiResponse<List<Station>>> getAllStations() {
        return ResponseEntity.ok(ApiResponse.success(stationService.getAllStations()));
    }

    @GetMapping("/routes")
    public ResponseEntity<ApiResponse<List<Route>>> getAllRoutes() {
        return ResponseEntity.ok(ApiResponse.success(routeService.getAllRoutes()));
    }

    @GetMapping("/trips/search")
    public ResponseEntity<ApiResponse<List<TripDetailResponse>>> searchTrips(
            @RequestParam(required = false) String originCity,
            @RequestParam(required = false) String destinationCity,
            @RequestParam(required = false) String date
    ) {
        List<TripDetailResponse> trips = tripService.searchTrips(originCity, destinationCity, date);
        return ResponseEntity.ok(ApiResponse.success(trips));
    }

    @GetMapping("/trips/{tripId}/seats")
    public ResponseEntity<ApiResponse<TripDetailResponse>> getTripSeats(@PathVariable Long tripId) {
        TripDetailResponse tripDetails = tripService.getTripDetailsWithSeats(tripId);
        return ResponseEntity.ok(ApiResponse.success(tripDetails));
    }
}
