package me.nilushan.mybus.service;

import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.BillingSummaryResponse;
import me.nilushan.mybus.dto.BookingResponse;
import me.nilushan.mybus.dto.StaffRequest;
import me.nilushan.mybus.entity.User;
import me.nilushan.mybus.entity.enums.BookingStatusType;
import me.nilushan.mybus.entity.enums.UserRole;
import me.nilushan.mybus.repo.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final BookingRepository bookingRepository;
    private final BusRepository busRepository;
    private final TripRepository tripRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final BookingService bookingService;
    private final PasswordEncoder passwordEncoder;

    public BillingSummaryResponse getBillingSummary() {
        BigDecimal totalRevenue = bookingRepository.sumTotalAmountByStatus(BookingStatusType.confirmed);
        long totalBookings = bookingRepository.count();
        long confirmed = bookingRepository.countByBookingStatus(BookingStatusType.confirmed);
        long cancelled = bookingRepository.countByBookingStatus(BookingStatusType.cancelled);
        long totalBuses = busRepository.count();
        long totalTrips = tripRepository.count();
        long totalPassengers = ticketRepository.count();

        List<BookingResponse> recentTransactions = bookingRepository.findAllByOrderByBookedAtDesc().stream()
                .limit(25)
                .map(b -> bookingService.getBookingByReference(b.getBookingReference()))
                .collect(Collectors.toList());

        return BillingSummaryResponse.builder()
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .totalBookings(totalBookings)
                .confirmedBookings(confirmed)
                .cancelledBookings(cancelled)
                .totalBuses(totalBuses)
                .totalTrips(totalTrips)
                .totalPassengers(totalPassengers)
                .recentTransactions(recentTransactions)
                .build();
    }

    public List<User> getAllStaff() {
        return userRepository.findAllByRole(UserRole.ROLE_STAFF);
    }

    @Transactional
    public User createStaff(StaffRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use: " + request.getEmail());
        }
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already in use: " + request.getPhoneNumber());
        }

        String rawPassword = request.getPassword() != null && !request.getPassword().isBlank() 
                ? request.getPassword() 
                : "staff123";

        User staff = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .passwordHash(passwordEncoder.encode(rawPassword))
                .role(request.getRole() != null ? request.getRole() : UserRole.ROLE_STAFF)
                .build();

        return userRepository.save(staff);
    }

    @Transactional
    public User updateStaff(String userId, StaffRequest request) {
        User staff = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Staff user not found: " + userId));

        staff.setFullName(request.getFullName());
        staff.setPhoneNumber(request.getPhoneNumber());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            staff.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRole() != null) {
            staff.setRole(request.getRole());
        }

        return userRepository.save(staff);
    }

    @Transactional
    public void deleteStaff(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Staff user not found: " + userId);
        }
        userRepository.deleteById(userId);
    }
}
