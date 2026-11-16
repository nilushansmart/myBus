package me.nilushan.mybus.service.impl;

import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.request.StaffRequest;
import me.nilushan.mybus.dto.response.BillingSummaryResponse;
import me.nilushan.mybus.dto.response.BookingResponse;
import me.nilushan.mybus.entity.*;
import me.nilushan.mybus.entity.enums.BookingStatusType;
import me.nilushan.mybus.entity.enums.UserRole;
import me.nilushan.mybus.exception.ConflictException;
import me.nilushan.mybus.exception.ResourceNotFoundException;
import me.nilushan.mybus.repository.*;
import me.nilushan.mybus.service.BillingService;
import me.nilushan.mybus.service.BookingService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillingServiceImpl implements BillingService {

    private final BookingRepository bookingRepository;
    private final BusRepository busRepository;
    private final TripRepository tripRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BusOperatorRepository operatorRepository;
    private final StaffTypeRepository staffTypeRepository;
    private final StaffProfileRepository staffProfileRepository;
    private final BookingService bookingService;
    private final PasswordEncoder passwordEncoder;

    @Override
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

    @Override
    public List<User> getAllStaff() {
        return userRepository.findAllByRoleType(UserRole.ROLE_STAFF);
    }

    @Override
    @Transactional
    public User createStaff(StaffRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already in use: " + request.getEmail());
        }
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new ConflictException("Phone number already in use: " + request.getPhoneNumber());
        }

        String rawPassword = request.getPassword() != null && !request.getPassword().isBlank()
                ? request.getPassword()
                : "staff123";

        UserRole roleType = request.getRole() != null ? request.getRole() : UserRole.ROLE_STAFF;
        Role role = roleRepository.findByRoleName(roleType.name()).orElse(null);

        User staff = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .passwordHash(passwordEncoder.encode(rawPassword))
                .role(role)
                .roleType(roleType)
                .build();

        User savedUser = userRepository.save(staff);

        // Associate with staff_profile if operator or staff type given
        BusOperator operator = null;
        if (request.getOperatorId() != null) {
            operator = operatorRepository.findById(request.getOperatorId()).orElse(null);
        }
        if (operator == null) {
            List<BusOperator> ops = operatorRepository.findAll();
            if (!ops.isEmpty())
                operator = ops.get(0);
        }

        StaffType staffType = null;
        if (request.getStaffTypeId() != null) {
            staffType = staffTypeRepository.findById(request.getStaffTypeId()).orElse(null);
        }
        if (staffType == null) {
            List<StaffType> types = staffTypeRepository.findAll();
            if (!types.isEmpty())
                staffType = types.get(0);
        }

        if (operator != null && staffType != null) {
            StaffProfile profile = StaffProfile.builder()
                    .user(savedUser)
                    .operator(operator)
                    .staffType(staffType)
                    .employeeCode(request.getEmployeeCode() != null ? request.getEmployeeCode()
                            : "EMP-" + savedUser.getUserId().substring(0, 5).toUpperCase())
                    .licenseNumber(request.getLicenseNumber() != null ? request.getLicenseNumber()
                            : "LIC-" + System.currentTimeMillis())
                    .isActive(true)
                    .build();
            staffProfileRepository.save(profile);
        }

        return savedUser;
    }

    @Override
    @Transactional
    public User updateStaff(String userId, StaffRequest request) {
        User staff = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff user not found: " + userId));

        staff.setFullName(request.getFullName());
        staff.setPhoneNumber(request.getPhoneNumber());
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            staff.setEmail(request.getEmail());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            staff.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRole() != null) {
            staff.setRoleType(request.getRole());
            roleRepository.findByRoleName(request.getRole().name()).ifPresent(staff::setRole);
        }

        User updated = userRepository.save(staff);

        // Update profile if present
        staffProfileRepository.findByUserUserId(userId).ifPresent(p -> {
            if (request.getEmployeeCode() != null)
                p.setEmployeeCode(request.getEmployeeCode());
            if (request.getLicenseNumber() != null)
                p.setLicenseNumber(request.getLicenseNumber());
            if (request.getOperatorId() != null) {
                operatorRepository.findById(request.getOperatorId()).ifPresent(p::setOperator);
            }
            if (request.getStaffTypeId() != null) {
                staffTypeRepository.findById(request.getStaffTypeId()).ifPresent(p::setStaffType);
            }
            staffProfileRepository.save(p);
        });

        return updated;
    }

    @Override
    @Transactional
    public void deleteStaff(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("Staff user not found: " + userId);
        }
        staffProfileRepository.findByUserUserId(userId).ifPresent(staffProfileRepository::delete);
        userRepository.deleteById(userId);
    }
}
