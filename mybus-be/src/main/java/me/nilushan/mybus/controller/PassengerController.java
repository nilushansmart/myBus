package me.nilushan.mybus.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.request.CreateBookingRequest;
import me.nilushan.mybus.dto.request.SeatLockRequest;
import me.nilushan.mybus.dto.response.ApiResponse;
import me.nilushan.mybus.dto.response.BookingResponse;
import me.nilushan.mybus.dto.response.SeatDto;
import me.nilushan.mybus.entity.User;
import me.nilushan.mybus.service.AuthService;
import me.nilushan.mybus.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passenger")
@RequiredArgsConstructor
public class PassengerController {

    private final BookingService bookingService;
    private final AuthService authService;

    @PostMapping("/seats/lock")
    public ResponseEntity<ApiResponse<List<SeatDto>>> lockSeats(
            @Valid @RequestBody SeatLockRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        List<SeatDto> lockedSeats = bookingService.lockSeats(request, user);
        return ResponseEntity.ok(ApiResponse.success("Seats locked for 10 minutes", lockedSeats));
    }

    @PostMapping("/bookings")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        BookingResponse booking = bookingService.createBooking(request, user);
        return ResponseEntity.ok(ApiResponse.success("Booking confirmed successfully", booking));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        List<BookingResponse> bookings = bookingService.getUserBookings(user);
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @GetMapping("/bookings/{reference}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingByReference(
            @PathVariable String reference
    ) {
        BookingResponse booking = bookingService.getBookingByReference(reference);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @PostMapping("/bookings/{reference}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable String reference,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        BookingResponse booking = bookingService.cancelBooking(reference, user);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", booking));
    }
}
