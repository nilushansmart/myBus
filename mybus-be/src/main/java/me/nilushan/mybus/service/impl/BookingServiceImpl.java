package me.nilushan.mybus.service.impl;

import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.request.CreateBookingRequest;
import me.nilushan.mybus.dto.request.PassengerInfoRequest;
import me.nilushan.mybus.dto.request.SeatLockRequest;
import me.nilushan.mybus.dto.response.BookingResponse;
import me.nilushan.mybus.dto.response.SeatDto;
import me.nilushan.mybus.entity.*;
import me.nilushan.mybus.entity.enums.BookingStatusType;
import me.nilushan.mybus.entity.enums.PaymentStatusType;
import me.nilushan.mybus.entity.enums.SeatReservationStatus;
import me.nilushan.mybus.exception.BadRequestException;
import me.nilushan.mybus.exception.ResourceNotFoundException;
import me.nilushan.mybus.mapper.BookingMapper;
import me.nilushan.mybus.mapper.TripMapper;
import me.nilushan.mybus.repository.*;
import me.nilushan.mybus.service.BookingService;
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
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final TripSeatRepository tripSeatRepository;
    private final SeatLockRepository seatLockRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentGatewayRepository paymentGatewayRepository;
    private final InvoiceRepository invoiceRepository;
    private final TripRepository tripRepository;
    private final StationRepository stationRepository;
    private final RouteStopRepository routeStopRepository;
    private final BookingMapper bookingMapper;
    private final TripMapper tripMapper;

    @Override
    @Transactional
    public List<SeatDto> lockSeats(SeatLockRequest request, User user) {
        // Release expired locks
        releaseExpiredLocks();

        List<TripSeat> tripSeats = tripSeatRepository.findByTripTripIdAndSeatIds(request.getTripId(),
                request.getSeatIds());

        if (tripSeats.size() != request.getSeatIds().size()) {
            throw new BadRequestException("One or more selected seats were not found for this trip");
        }

        for (TripSeat ts : tripSeats) {
            if (ts.getStatus() == SeatReservationStatus.booked) {
                throw new BadRequestException("Seat " + ts.getLayoutSeat().getSeatNumber() + " is already booked");
            }
            SeatLock lock = ts.getSeatLock();
            if (ts.getStatus() == SeatReservationStatus.locked && lock != null &&
                    !lock.getUser().getUserId().equals(user.getUserId()) &&
                    lock.getLockedUntil().isAfter(LocalDateTime.now())) {
                throw new BadRequestException(
                        "Seat " + ts.getLayoutSeat().getSeatNumber() + " is currently locked by another passenger");
            }

            ts.setStatus(SeatReservationStatus.locked);
            if (lock == null) {
                lock = SeatLock.builder()
                        .tripSeat(ts)
                        .user(user)
                        .lockedUntil(LocalDateTime.now().plusMinutes(10))
                        .build();
            } else {
                lock.setUser(user);
                lock.setLockedUntil(LocalDateTime.now().plusMinutes(10));
            }
            ts.setSeatLock(lock);
            seatLockRepository.save(lock);
        }

        List<TripSeat> savedSeats = tripSeatRepository.saveAll(tripSeats);
        return savedSeats.stream().map(tripMapper::toSeatDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request, User user) {
        releaseExpiredLocks();

        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + request.getTripId()));

        List<Long> seatIds = request.getPassengers().stream()
                .map(PassengerInfoRequest::getSeatId)
                .collect(Collectors.toList());

        List<TripSeat> tripSeats = tripSeatRepository.findByTripTripIdAndSeatIds(trip.getTripId(), seatIds);

        for (TripSeat ts : tripSeats) {
            if (ts.getStatus() == SeatReservationStatus.booked) {
                throw new BadRequestException("Seat " + ts.getLayoutSeat().getSeatNumber() + " is already booked");
            }
            SeatLock lock = ts.getSeatLock();
            if (ts.getStatus() == SeatReservationStatus.locked && lock != null &&
                    !lock.getUser().getUserId().equals(user.getUserId())) {
                throw new BadRequestException(
                        "Seat " + ts.getLayoutSeat().getSeatNumber() + " is locked by another user");
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
                    .filter(s -> s.getLayoutSeat().getLayoutSeatId().equals(pReq.getSeatId()))
                    .findFirst()
                    .orElseThrow(() -> new BadRequestException("Seat mapping not found"));

            // Mark seat as booked and remove lock
            ts.setStatus(SeatReservationStatus.booked);
            if (ts.getSeatLock() != null) {
                seatLockRepository.delete(ts.getSeatLock());
                ts.setSeatLock(null);
            }
            tripSeatRepository.save(ts);

            Station boarding = pReq.getBoardingStationId() != null
                    ? stationRepository.findById(pReq.getBoardingStationId()).orElse(trip.getRoute().getOriginStation())
                    : trip.getRoute().getOriginStation();

            Station dropping = pReq.getDroppingStationId() != null
                    ? stationRepository.findById(pReq.getDroppingStationId())
                            .orElse(trip.getRoute().getDestinationStation())
                    : trip.getRoute().getDestinationStation();

            // Locate route stops if available
            RouteStop bStop = routeStopRepository.findByRouteRouteIdOrderByStopSequenceAsc(trip.getRoute().getRouteId())
                    .stream()
                    .filter(rs -> rs.getStation().getStationId().equals(boarding.getStationId()))
                    .findFirst().orElse(null);

            RouteStop dStop = routeStopRepository.findByRouteRouteIdOrderByStopSequenceAsc(trip.getRoute().getRouteId())
                    .stream()
                    .filter(rs -> rs.getStation().getStationId().equals(dropping.getStationId()))
                    .findFirst().orElse(null);

            Ticket ticket = Ticket.builder()
                    .booking(savedBooking)
                    .tripSeat(ts)
                    .passengerName(pReq.getPassengerName())
                    .passengerAge(pReq.getPassengerAge())
                    .passengerGender(pReq.getPassengerGender())
                    .boardingStation(boarding)
                    .droppingStation(dropping)
                    .boardingStop(bStop)
                    .droppingStop(dStop)
                    .fareAmount(farePerSeat)
                    .isCheckedIn(false)
                    .build();

            tickets.add(ticket);
        }

        ticketRepository.saveAll(tickets);

        // Payment Method & Gateway resolution
        PaymentMethod method = paymentMethodRepository.findByCode("CARD").orElse(null);
        PaymentGateway gateway = paymentGatewayRepository.findByCode("INTERNAL").orElse(null);

        Payment payment = Payment.builder()
                .booking(savedBooking)
                .paymentMethod(method)
                .paymentGateway(gateway)
                .transactionReference("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase())
                .gatewayName(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CreditCard")
                .amount(totalAmount)
                .paymentStatus(PaymentStatusType.successful)
                .paymentTimestamp(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        // Invoice creation (as per ERD: bookings ||--o| invoices : billed)
        Invoice invoice = Invoice.builder()
                .booking(savedBooking)
                .invoiceNumber("INV-" + System.currentTimeMillis() % 10000000)
                .subtotal(totalAmount)
                .taxAmount(BigDecimal.ZERO)
                .totalAmount(totalAmount)
                .issuedAt(LocalDateTime.now())
                .status("PAID")
                .build();
        invoiceRepository.save(invoice);
        savedBooking.setInvoice(invoice);

        return bookingMapper.toResponse(savedBooking, tickets, payment, trip);
    }

    @Override
    public List<BookingResponse> getUserBookings(User user) {
        return bookingRepository.findByUserUserIdOrderByBookedAtDesc(user.getUserId()).stream()
                .map(this::mapEntityToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponse getBookingByReference(String bookingRef) {
        Booking booking = bookingRepository.findByBookingReference(bookingRef)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + bookingRef));
        return mapEntityToBookingResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(String bookingRef, User user) {
        Booking booking = bookingRepository.findByBookingReference(bookingRef)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + bookingRef));

        // Check ownership unless admin/owner
        boolean isOwner = user.getRoleType() != null && user.getRoleType().name().contains("OWNER");
        if (!booking.getUser().getUserId().equals(user.getUserId()) && !isOwner) {
            throw new BadRequestException("You are not authorized to cancel this booking");
        }

        booking.setBookingStatus(BookingStatusType.cancelled);
        bookingRepository.save(booking);

        // Release seats
        List<Ticket> tickets = ticketRepository.findByBookingBookingId(booking.getBookingId());
        for (Ticket t : tickets) {
            TripSeat ts = t.getTripSeat();
            ts.setStatus(SeatReservationStatus.available);
            if (ts.getSeatLock() != null) {
                seatLockRepository.delete(ts.getSeatLock());
                ts.setSeatLock(null);
            }
            tripSeatRepository.save(ts);
        }

        return mapEntityToBookingResponse(booking);
    }

    private void releaseExpiredLocks() {
        seatLockRepository.deleteExpiredLocks(LocalDateTime.now());
        // For any trip seats whose locks were removed and are not booked, set available
        List<TripSeat> seats = tripSeatRepository.findAll();
        for (TripSeat ts : seats) {
            if (ts.getStatus() == SeatReservationStatus.locked
                    && (ts.getSeatLock() == null || ts.getSeatLock().getLockedUntil().isBefore(LocalDateTime.now()))) {
                ts.setStatus(SeatReservationStatus.available);
                tripSeatRepository.save(ts);
            }
        }
    }

    private BookingResponse mapEntityToBookingResponse(Booking booking) {
        List<Ticket> tickets = ticketRepository.findByBookingBookingId(booking.getBookingId());
        Payment payment = paymentRepository.findByBookingBookingId(booking.getBookingId()).orElse(null);
        Trip trip = tickets.isEmpty() ? null : tickets.get(0).getTripSeat().getTrip();
        return bookingMapper.toResponse(booking, tickets, payment, trip);
    }
}
