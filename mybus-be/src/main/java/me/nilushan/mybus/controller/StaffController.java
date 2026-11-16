package me.nilushan.mybus.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.*;
import me.nilushan.mybus.entity.Trip;
import me.nilushan.mybus.entity.enums.TripStatus;
import me.nilushan.mybus.service.StaffService;
import me.nilushan.mybus.service.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;
    private final TripService tripService;

    @GetMapping("/trips")
    public ResponseEntity<ApiResponse<List<TripDetailResponse>>> getAssignedTrips() {
        return ResponseEntity.ok(ApiResponse.success(staffService.getUpcomingTrips()));
    }

    @GetMapping("/trips/{tripId}/manifest")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getTripManifest(@PathVariable Long tripId) {
        return ResponseEntity.ok(ApiResponse.success(staffService.getTripManifest(tripId)));
    }

    @GetMapping("/trips/{tripId}/search")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> searchTripPassengers(
            @PathVariable Long tripId,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(ApiResponse.success(staffService.searchTickets(tripId, keyword)));
    }

    @PostMapping("/tickets/checkin")
    public ResponseEntity<ApiResponse<TicketResponse>> checkInPassenger(@Valid @RequestBody CheckInRequest request) {
        TicketResponse ticket = staffService.checkInTicket(request);
        return ResponseEntity.ok(ApiResponse.success(
                ticket.getIsCheckedIn() ? "Passenger checked in successfully" : "Check-in undone",
                ticket));
    }

    @GetMapping("/tickets/lookup/{bookingRef}")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> lookupTicketsByReference(@PathVariable String bookingRef) {
        return ResponseEntity.ok(ApiResponse.success(staffService.findTicketsByBookingRef(bookingRef)));
    }

    @PutMapping("/trips/{tripId}/status")
    public ResponseEntity<ApiResponse<TripDetailResponse>> updateTripStatus(
            @PathVariable Long tripId,
            @RequestParam(required = false) TripStatus status,
            @RequestBody(required = false) Map<String, Object> body) {
        TripStatus resolvedStatus = status;
        if (resolvedStatus == null && body != null && body.containsKey("status")) {
            resolvedStatus = TripStatus.valueOf(body.get("status").toString().toLowerCase());
        }
        if (resolvedStatus == null) {
            throw new RuntimeException(
                    "Trip status must be provided as a query param or in JSON body (e.g. status=delayed)");
        }
        Trip trip = tripService.updateTripStatus(tripId, resolvedStatus);
        return ResponseEntity
                .ok(ApiResponse.success("Trip status updated to " + resolvedStatus, tripService.mapToTripDetail(trip)));
    }
                
}
