package me.nilushan.mybus.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.nilushan.mybus.dto.CreateBookingRequest;
import me.nilushan.mybus.dto.PassengerInfoRequest;
import me.nilushan.mybus.entity.*;
import me.nilushan.mybus.entity.enums.*;
import me.nilushan.mybus.repo.*;
import me.nilushan.mybus.service.BookingService;
import me.nilushan.mybus.service.FleetService;
import me.nilushan.mybus.service.TripService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BusOperatorRepository operatorRepository;
    private final StationRepository stationRepository;
    private final RouteRepository routeRepository;
    private final BusRepository busRepository;
    private final TripRepository tripRepository;
    private final TripSeatRepository tripSeatRepository;
    private final PasswordEncoder passwordEncoder;
    private final FleetService fleetService;
    private final TripService tripService;
    private final BookingService bookingService;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial seeding.");
            return;
        }

        log.info("Seeding initial data for mybus ticketing system...");

        // 1. Create Users
        User owner = User.builder()
                .fullName("System Administrator")
                .email("owner@mybus.com")
                .phoneNumber("+94771234567")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(UserRole.ROLE_OWNER)
                .build();
        userRepository.save(owner);

        User staff = User.builder()
                .fullName("Kamal Perera (Driver/Staff)")
                .email("staff@mybus.com")
                .phoneNumber("+94772345678")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(UserRole.ROLE_STAFF)
                .build();
        userRepository.save(staff);

        User passenger = User.builder()
                .fullName("Nimal Fernando")
                .email("passenger@mybus.com")
                .phoneNumber("+94773456789")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(UserRole.ROLE_PASSENGER)
                .build();
        User savedPassenger = userRepository.save(passenger);

        // 2. Bus Operators
        BusOperator operator = BusOperator.builder()
                .operatorName("SuperLine Express Lanka")
                .contactPhone("+94112345678")
                .contactEmail("contact@superline.lk")
                .isActive(true)
                .build();
        BusOperator savedOp = operatorRepository.save(operator);

        // 3. Stations
        Station colombo = stationRepository.save(Station.builder()
                .stationName("Colombo Central Bastian Mawatha")
                .city("Colombo")
                .state("Western")
                .address("Bastian Mawatha, Pettah, Colombo 11")
                .latitude(6.9344)
                .longitude(79.8512)
                .build());

        Station kandy = stationRepository.save(Station.builder()
                .stationName("Kandy Goodshed Bus Stand")
                .city("Kandy")
                .state("Central")
                .address("Goodshed, Kandy City")
                .latitude(7.2906)
                .longitude(80.6337)
                .build());

        Station galle = stationRepository.save(Station.builder()
                .stationName("Galle Central Terminal")
                .city("Galle")
                .state("Southern")
                .address("Station Road, Galle")
                .latitude(6.0535)
                .longitude(80.2210)
                .build());

        Station matara = stationRepository.save(Station.builder()
                .stationName("Matara Bus Station")
                .city("Matara")
                .state("Southern")
                .address("Old Tangalle Road, Matara")
                .latitude(5.9549)
                .longitude(80.5550)
                .build());

        Station jaffna = stationRepository.save(Station.builder()
                .stationName("Jaffna Main Bus Terminal")
                .city("Jaffna")
                .state("Northern")
                .address("Hospital Road, Jaffna")
                .latitude(9.6615)
                .longitude(80.0255)
                .build());

        // 4. Routes
        Route r1 = routeRepository.save(Route.builder()
                .originStation(colombo)
                .destinationStation(kandy)
                .estimatedDurationMinutes(210)
                .totalDistanceKm(115.5)
                .build());

        Route r2 = routeRepository.save(Route.builder()
                .originStation(colombo)
                .destinationStation(galle)
                .estimatedDurationMinutes(120)
                .totalDistanceKm(125.0)
                .build());

        Route r3 = routeRepository.save(Route.builder()
                .originStation(colombo)
                .destinationStation(jaffna)
                .estimatedDurationMinutes(480)
                .totalDistanceKm(395.0)
                .build());

        Route r4 = routeRepository.save(Route.builder()
                .originStation(kandy)
                .destinationStation(colombo)
                .estimatedDurationMinutes(210)
                .totalDistanceKm(115.5)
                .build());

        // 5. Buses
        Bus b1 = busRepository.save(Bus.builder()
                .operator(savedOp)
                .registrationNumber("WP-NC-8821")
                .busClass(BusType.AC_Seater)
                .totalCapacity(40)
                .isActive(true)
                .build());
        fleetService.generateDefaultSeats(b1);

        Bus b2 = busRepository.save(Bus.builder()
                .operator(savedOp)
                .registrationNumber("WP-ND-5510")
                .busClass(BusType.AC_Sleeper)
                .totalCapacity(30)
                .isActive(true)
                .build());
        fleetService.generateDefaultSeats(b2);

        Bus b3 = busRepository.save(Bus.builder()
                .operator(savedOp)
                .registrationNumber("SP-NE-2300")
                .busClass(BusType.Non_AC_Seater)
                .totalCapacity(44)
                .isActive(true)
                .build());
        fleetService.generateDefaultSeats(b3);

        // 6. Trips
        LocalDateTime now = LocalDateTime.now();

        Trip t1 = tripRepository.save(Trip.builder()
                .bus(b1)
                .route(r1)
                .departureTime(now.plusHours(2))
                .arrivalTime(now.plusHours(5).plusMinutes(30))
                .baseFare(BigDecimal.valueOf(1450.00))
                .status(TripStatus.scheduled)
                .build());

        Trip t2 = tripRepository.save(Trip.builder()
                .bus(b2)
                .route(r3)
                .departureTime(now.plusHours(6))
                .arrivalTime(now.plusHours(14))
                .baseFare(BigDecimal.valueOf(3200.00))
                .status(TripStatus.scheduled)
                .build());

        Trip t3 = tripRepository.save(Trip.builder()
                .bus(b3)
                .route(r2)
                .departureTime(now.plusHours(4))
                .arrivalTime(now.plusHours(6))
                .baseFare(BigDecimal.valueOf(950.00))
                .status(TripStatus.scheduled)
                .build());

        Trip t4 = tripRepository.save(Trip.builder()
                .bus(b1)
                .route(r4)
                .departureTime(now.plusDays(1).withHour(8).withMinute(0))
                .arrivalTime(now.plusDays(1).withHour(11).withMinute(30))
                .baseFare(BigDecimal.valueOf(1450.00))
                .status(TripStatus.scheduled)
                .build());

        // Create seats for each trip
        for (Trip t : List.of(t1, t2, t3, t4)) {
            List<Seat> seats = fleetService.getSeatsForBus(t.getBus().getBusId());
            List<TripSeat> tSeats = new java.util.ArrayList<>();
            for (Seat seat : seats) {
                tSeats.add(TripSeat.builder()
                        .trip(t)
                        .seat(seat)
                        .status(SeatReservationStatus.available)
                        .build());
            }
            tripSeatRepository.saveAll(tSeats);
        }

        // Seed a sample confirmed booking for passenger on t1
        List<TripSeat> t1Seats = tripSeatRepository.findSeatsByTripId(t1.getTripId());
        if (!t1Seats.isEmpty()) {
            PassengerInfoRequest p1 = new PassengerInfoRequest();
            p1.setSeatId(t1Seats.get(0).getSeat().getSeatId());
            p1.setPassengerName("Nimal Fernando");
            p1.setPassengerAge(32);
            p1.setPassengerGender(GenderType.male);
            p1.setBoardingStationId(colombo.getStationId());
            p1.setDroppingStationId(kandy.getStationId());

            CreateBookingRequest bReq = new CreateBookingRequest();
            bReq.setTripId(t1.getTripId());
            bReq.setPassengers(List.of(p1));
            bReq.setPaymentMethod("Visa Card");

            try {
                bookingService.createBooking(bReq, savedPassenger);
            } catch (Exception e) {
                log.warn("Sample booking skipped: {}", e.getMessage());
            }
        }

        log.info("Database seeding completed successfully!");
    }
}
