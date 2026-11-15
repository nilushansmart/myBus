package me.nilushan.mybus.service;

import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.*;
import me.nilushan.mybus.entity.*;
import me.nilushan.mybus.entity.enums.BookingStatusType;
import me.nilushan.mybus.entity.enums.PaymentStatusType;
import me.nilushan.mybus.entity.enums.SeatReservationStatus;
import me.nilushan.mybus.repo.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final TripSeatRepository tripSeatRepository;
    private final PaymentRepository paymentRepository;
    private final TripRepository tripRepository;
    private final StationRepository stationRepository;

    @Transactional
    public List<SeatDto> lockSeats(SeatLockRequest request, User user) {
        tripSeatRepository.releaseExpiredLocks(LocalDateTime.now());

        List<TripSeat> tripSeats = tripSeatRepository.findByTripTripIdAndSeatIds(request.getTripId(), request.getSeatIds());

        if (tripSeats.size() != request.getSeatIds().size()) {
            throw new RuntimeException("One or more selected seats were not found for this trip");
        }

        for (TripSeat ts : tripSeats) {
            if (ts.getStatus() == SeatReservationStatus.booked) {
                throw new RuntimeException("Seat " + ts.getSeat().getSeatNumber() + " is already booked");
            }
            if (ts.getStatus() == SeatReservationStatus.locked &&
                ts.getLockedByUser() != null &&
                !ts.getLockedByUser().getUserId().equals(user.getUserId()) &&
                ts.getLockedUntil().isAfter(LocalDateTime.now())) {
                throw new RuntimeException("Seat " + ts.getSeat().getSeatNumber() + " is currently locked by another passenger");
            }

            ts.setStatus(SeatReservationStatus.locked);
            ts.setLockedUntil(LocalDateTime.now().plusMinutes(10));
            ts.setLockedByUser(user);
        }

        List<TripSeat> savedSeats = tripSeatRepository.saveAll(tripSeats);

        return savedSeats.stream()
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
                        .lockedByUserId(ts.getLockedByUser().getUserId())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request, User user) {
        tripSeatRepository.releaseExpiredLocks(LocalDateTime.now());

        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new RuntimeException("Trip not found with id: " + request.getTripId()));

        List<Long> seatIds = request.getPassengers().stream()
                .map(PassengerInfoRequest::getSeatId)
                .collect(Collectors.toList());

        List<TripSeat> tripSeats = tripSeatRepository.findByTripTripIdAndSeatIds(trip.getTripId(), seatIds);

        for (TripSeat ts : tripSeats) {
            if (ts.getStatus() == SeatReservationStatus.booked) {
                throw new RuntimeException("Seat " + ts.getSeat().getSeatNumber() + " is already booked");
            }
            if (ts.getStatus() == SeatReservationStatus.locked &&
                ts.getLockedByUser() != null &&
                !ts.getLockedByUser().getUserId().equals(user.getUserId())) {
                throw new RuntimeException("Seat " + ts.getSeat().getSeatNumber() + " is locked by another user");
            }
        }

        BigDecimal farePerSeat = trip.getBaseFare();
        BigDecimal totalAmount = farePerSeat.multiply(BigDecimal.valueOf(request.getPassengers().size()));

        String bookingReference = "MB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Booking booking = Booking.builder()
                .bookingReference(bookingReference)
                .user(user)
                .bookingStatus(BookingStatusType.confirmed)
                .totalAmount(totalAmount)
                .bookedAt(LocalDateTime.now())
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        List<Ticket> tickets = new ArrayList<>();
        for (PassengerInfoRequest pReq : request.getPassengers()) {
            TripSeat ts = tripSeats.stream()
                    .filter(s -> s.getSeat().getSeatId().equals(pReq.getSeatId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Seat mapping not found"));

            // Mark seat as booked
            ts.setStatus(SeatReservationStatus.booked);
            ts.setLockedUntil(null);
            ts.setLockedByUser(user);
            tripSeatRepository.save(ts);

            Station boarding = pReq.getBoardingStationId() != null
                    ? stationRepository.findById(pReq.getBoardingStationId()).orElse(trip.getRoute().getOriginStation())
                    : trip.getRoute().getOriginStation();

            Station dropping = pReq.getDroppingStationId() != null
                    ? stationRepository.findById(pReq.getDroppingStationId()).orElse(trip.getRoute().getDestinationStation())
                    : trip.getRoute().getDestinationStation();

            Ticket ticket = Ticket.builder()
                    .booking(savedBooking)
                    .tripSeat(ts)
                    .passengerName(pReq.getPassengerName())
                    .passengerAge(pReq.getPassengerAge())
                    .passengerGender(pReq.getPassengerGender())
                    .boardingStation(boarding)
                    .droppingStation(dropping)
                    .fareAmount(farePerSeat)
                    .isCheckedIn(false)
                    .build();

            tickets.add(ticket);
        }

        ticketRepository.saveAll(tickets);

        // Payment record
        Payment payment = Payment.builder()
                .booking(savedBooking)
                .transactionReference("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase())
                .gatewayName(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CreditCard")
                .amount(totalAmount)
                .paymentStatus(PaymentStatusType.successful)
                .paymentTimestamp(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        return mapToBookingResponse(savedBooking, tickets, payment, trip);
    }

    public List<BookingResponse> getUserBookings(User user) {
        return bookingRepository.findByUserUserIdOrderByBookedAtDesc(user.getUserId()).stream()
                .map(this::mapEntityToBookingResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingByReference(String bookingRef) {
        Booking booking = bookingRepository.findByBookingReference(bookingRef)
                .orElseThrow(() -> new RuntimeException("Booking not found with reference: " + bookingRef));
        return mapEntityToBookingResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(String bookingRef, User user) {
        Booking booking = bookingRepository.findByBookingReference(bookingRef)
                .orElseThrow(() -> new RuntimeException("Booking not found with reference: " + bookingRef));

        // Check ownership unless admin/owner
        if (!booking.getUser().getUserId().equals(user.getUserId()) && !user.getRole().name().equals("ROLE_OWNER")) {
            throw new RuntimeException("You are not authorized to cancel this booking");
        }

        booking.setBookingStatus(BookingStatusType.cancelled);
        bookingRepository.save(booking);

        // Release seats
        List<Ticket> tickets = ticketRepository.findByBookingBookingId(booking.getBookingId());
        for (Ticket t : tickets) {
            TripSeat ts = t.getTripSeat();
            ts.setStatus(SeatReservationStatus.available);
            ts.setLockedUntil(null);
            ts.setLockedByUser(null);
            tripSeatRepository.save(ts);
        }

        return mapEntityToBookingResponse(booking);
    }

    private BookingResponse mapEntityToBookingResponse(Booking booking) {
        List<Ticket> tickets = ticketRepository.findByBookingBookingId(booking.getBookingId());
        Payment payment = paymentRepository.findByBookingBookingId(booking.getBookingId()).orElse(null);
        Trip trip = tickets.isEmpty() ? null : tickets.get(0).getTripSeat().getTrip();
        return mapToBookingResponse(booking, tickets, payment, trip);
    }

    private BookingResponse mapToBookingResponse(Booking booking, List<Ticket> tickets, Payment payment, Trip trip) {
        List<TicketResponse> ticketResponses = tickets.stream()
                .map(t -> TicketResponse.builder()
                        .ticketId(t.getTicketId())
                        .tripSeatId(t.getTripSeat().getTripSeatId())
                        .seatNumber(t.getTripSeat().getSeat().getSeatNumber())
                        .deck(t.getTripSeat().getSeat().getDeck())
                        .seatType(t.getTripSeat().getSeat().getSeatType())
                        .passengerName(t.getPassengerName())
                        .passengerAge(t.getPassengerAge())
                        .passengerGender(t.getPassengerGender())
                        .boardingStationName(t.getBoardingStation() != null ? t.getBoardingStation().getStationName() : "")
                        .droppingStationName(t.getDroppingStation() != null ? t.getDroppingStation().getStationName() : "")
                        .fareAmount(t.getFareAmount())
                        .isCheckedIn(t.getIsCheckedIn())
                        .checkedInAt(t.getCheckedInAt())
                        .build())
                .collect(Collectors.toList());

        return BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .bookingReference(booking.getBookingReference())
                .bookingStatus(booking.getBookingStatus())
                .totalAmount(booking.getTotalAmount())
                .bookedAt(booking.getBookedAt())
                .userId(booking.getUser().getUserId())
                .userFullName(booking.getUser().getFullName())
                .userEmail(booking.getUser().getEmail())
                .userPhone(booking.getUser().getPhoneNumber())
                .tripId(trip != null ? trip.getTripId() : null)
                .busRegistrationNumber(trip != null ? trip.getBus().getRegistrationNumber() : "")
                .busClass(trip != null ? trip.getBus().getBusClass() : null)
                .operatorName(trip != null ? trip.getBus().getOperator().getOperatorName() : "")
                .originCity(trip != null ? trip.getRoute().getOriginStation().getCity() : "")
                .originStationName(trip != null ? trip.getRoute().getOriginStation().getStationName() : "")
                .destinationCity(trip != null ? trip.getRoute().getDestinationStation().getCity() : "")
                .destinationStationName(trip != null ? trip.getRoute().getDestinationStation().getStationName() : "")
                .departureTime(trip != null ? trip.getDepartureTime() : null)
                .arrivalTime(trip != null ? trip.getArrivalTime() : null)
                .tickets(ticketResponses)
                .transactionReference(payment != null ? payment.getTransactionReference() : "")
                .paymentStatus(payment != null ? payment.getPaymentStatus().name() : "")
                .build();
    }
}
