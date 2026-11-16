package me.nilushan.mybus.service;

import me.nilushan.mybus.dto.request.CreateBookingRequest;
import me.nilushan.mybus.dto.request.SeatLockRequest;
import me.nilushan.mybus.dto.response.BookingResponse;
import me.nilushan.mybus.dto.response.SeatDto;
import me.nilushan.mybus.entity.User;

import java.util.List;

public interface BookingService {
    List<SeatDto> lockSeats(SeatLockRequest request, User user);

    BookingResponse createBooking(CreateBookingRequest request, User user);

    List<BookingResponse> getUserBookings(User user);

    BookingResponse getBookingByReference(String bookingRef);

    BookingResponse cancelBooking(String bookingRef, User user);
}
