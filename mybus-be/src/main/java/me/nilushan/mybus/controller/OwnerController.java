package me.nilushan.mybus.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.*;
import me.nilushan.mybus.entity.*;
import me.nilushan.mybus.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
public class OwnerController {

    private final FleetService fleetService;
    private final RouteService routeService;
    private final StationService stationService;
    private final TripService tripService;
    private final BillingService billingService;

    // --- Staff Management ---
    @GetMapping("/staff")
    public ResponseEntity<ApiResponse<List<User>>> getAllStaff() {
        return ResponseEntity.ok(ApiResponse.success(billingService.getAllStaff()));
    }

    @PostMapping("/staff")
    public ResponseEntity<ApiResponse<User>> createStaff(@Valid @RequestBody StaffRequest request) {
        User staff = billingService.createStaff(request);
        return ResponseEntity.ok(ApiResponse.success("Staff member created successfully", staff));
    }

    @PutMapping("/staff/{id}")
    public ResponseEntity<ApiResponse<User>> updateStaff(@PathVariable String id, @Valid @RequestBody StaffRequest request) {
        User staff = billingService.updateStaff(id, request);
        return ResponseEntity.ok(ApiResponse.success("Staff member updated successfully", staff));
    }

    @DeleteMapping("/staff/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(@PathVariable String id) {
        billingService.deleteStaff(id);
        return ResponseEntity.ok(ApiResponse.success("Staff member deleted successfully", null));
    }

    // --- Fleet & Buses ---
    @GetMapping("/buses")
    public ResponseEntity<ApiResponse<List<Bus>>> getAllBuses() {
        return ResponseEntity.ok(ApiResponse.success(fleetService.getAllBuses()));
    }

    @PostMapping("/buses")
    public ResponseEntity<ApiResponse<Bus>> createBus(@Valid @RequestBody BusRequest request) {
        Bus bus = fleetService.createBus(request);
        return ResponseEntity.ok(ApiResponse.success("Bus created successfully with layout", bus));
    }

    @PutMapping("/buses/{id}")
    public ResponseEntity<ApiResponse<Bus>> updateBus(@PathVariable Long id, @Valid @RequestBody BusRequest request) {
        Bus bus = fleetService.updateBus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Bus updated successfully", bus));
    }

    @DeleteMapping("/buses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBus(@PathVariable Long id) {
        fleetService.deleteBus(id);
        return ResponseEntity.ok(ApiResponse.success("Bus deleted successfully", null));
    }

    @GetMapping("/buses/{id}/seats")
    public ResponseEntity<ApiResponse<List<Seat>>> getBusSeats(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(fleetService.getSeatsForBus(id)));
    }

    @PostMapping("/buses/{id}/seats/generate")
    public ResponseEntity<ApiResponse<Void>> regenerateSeats(@PathVariable Long id) {
        Bus bus = fleetService.getBusById(id);
        fleetService.generateDefaultSeats(bus);
        return ResponseEntity.ok(ApiResponse.success("Seats regenerated successfully", null));
    }

    @GetMapping("/operators")
    public ResponseEntity<ApiResponse<List<BusOperator>>> getAllOperators() {
        return ResponseEntity.ok(ApiResponse.success(fleetService.getAllOperators()));
    }

    @PostMapping("/operators")
    public ResponseEntity<ApiResponse<BusOperator>> createOperator(@RequestBody BusOperator operator) {
        return ResponseEntity.ok(ApiResponse.success("Operator registered", fleetService.createOperator(operator)));
    }

    // --- Stations & Routes ---
    @PostMapping("/stations")
    public ResponseEntity<ApiResponse<Station>> createStation(@RequestBody Station station) {
        return ResponseEntity.ok(ApiResponse.success("Station created", stationService.createStation(station)));
    }

    @GetMapping("/routes")
    public ResponseEntity<ApiResponse<List<Route>>> getAllRoutes() {
        return ResponseEntity.ok(ApiResponse.success(routeService.getAllRoutes()));
    }

    @PostMapping("/routes")
    public ResponseEntity<ApiResponse<Route>> createRoute(@Valid @RequestBody RouteRequest request) {
        Route route = routeService.createRoute(request);
        return ResponseEntity.ok(ApiResponse.success("Route created successfully", route));
    }

    @PutMapping("/routes/{id}")
    public ResponseEntity<ApiResponse<Route>> updateRoute(@PathVariable Long id, @Valid @RequestBody RouteRequest request) {
        Route route = routeService.updateRoute(id, request);
        return ResponseEntity.ok(ApiResponse.success("Route updated successfully", route));
    }

    @DeleteMapping("/routes/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        return ResponseEntity.ok(ApiResponse.success("Route deleted successfully", null));
    }

    // --- Timetables / Trips ---
    @GetMapping("/trips")
    public ResponseEntity<ApiResponse<List<TripDetailResponse>>> getAllTrips() {
        return ResponseEntity.ok(ApiResponse.success(tripService.getAllTrips()));
    }

    @PostMapping("/trips")
    public ResponseEntity<ApiResponse<Trip>> createTrip(@Valid @RequestBody TripRequest request) {
        Trip trip = tripService.createTrip(request);
        return ResponseEntity.ok(ApiResponse.success("Trip scheduled successfully with seat inventory", trip));
    }

    @PutMapping("/trips/{id}")
    public ResponseEntity<ApiResponse<Trip>> updateTrip(@PathVariable Long id, @Valid @RequestBody TripRequest request) {
        Trip trip = tripService.updateTrip(id, request);
        return ResponseEntity.ok(ApiResponse.success("Trip updated successfully", trip));
    }

    @DeleteMapping("/trips/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.ok(ApiResponse.success("Trip cancelled/deleted successfully", null));
    }

    // --- Billing & Analytics Hub ---
    @GetMapping("/billing/summary")
    public ResponseEntity<ApiResponse<BillingSummaryResponse>> getBillingSummary() {
        return ResponseEntity.ok(ApiResponse.success(billingService.getBillingSummary()));
    }
}
