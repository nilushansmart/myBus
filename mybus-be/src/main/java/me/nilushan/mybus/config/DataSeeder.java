package me.nilushan.mybus.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.nilushan.mybus.dto.request.CreateBookingRequest;
import me.nilushan.mybus.dto.request.PassengerInfoRequest;
import me.nilushan.mybus.dto.request.TripRequest;
import me.nilushan.mybus.entity.*;
import me.nilushan.mybus.entity.enums.BusType;
import me.nilushan.mybus.entity.enums.GenderType;
import me.nilushan.mybus.entity.enums.TripStatus;
import me.nilushan.mybus.entity.enums.UserRole;
import me.nilushan.mybus.repository.*;
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

    private final RoleRepository roleRepository;
    private final StaffTypeRepository staffTypeRepository;
    private final BusClassRepository busClassRepository;
    private final SeatTypeRepository seatTypeRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentGatewayRepository paymentGatewayRepository;
    private final NotificationTypeRepository notificationTypeRepository;
    private final ProvinceRepository provinceRepository;
    private final CityRepository cityRepository;
    private final StationRepository stationRepository;
    private final BusOperatorRepository operatorRepository;
    private final UserRepository userRepository;
    private final StaffProfileRepository staffProfileRepository;
    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;
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

        log.info("Seeding initial data for mybus ticketing system according to new normalized ERD...");

        // 1. Roles
        Role roleOwner = roleRepository.save(Role.builder().roleName("ROLE_OWNER").description("System Administrator / Bus Owner").build());
        Role roleStaff = roleRepository.save(Role.builder().roleName("ROLE_STAFF").description("Bus Driver / Conductor / Staff").build());
        Role rolePassenger = roleRepository.save(Role.builder().roleName("ROLE_PASSENGER").description("Passenger / Customer").build());
        roleRepository.save(Role.builder().roleName("ROLE_ADMIN").description("Super Administrator").build());

        // 2. Staff Types
        StaffType driverType = staffTypeRepository.save(StaffType.builder().name("Driver").code("DRV").description("Bus Driver").build());
        StaffType conductorType = staffTypeRepository.save(StaffType.builder().name("Conductor").code("CND").description("Bus Conductor").build());
        staffTypeRepository.save(StaffType.builder().name("Inspector").code("INS").description("Route Ticket Inspector").build());

        // 3. Bus Classes
        BusClass acSeaterClass = busClassRepository.save(BusClass.builder().className("AC Seater").code("AC_Seater").amenities("AC, Pushback Seats, USB Charging").build());
        BusClass acSleeperClass = busClassRepository.save(BusClass.builder().className("AC Sleeper").code("AC_Sleeper").amenities("AC, Bunk Beds, Reading Lights, Blankets").build());
        BusClass nonAcSeaterClass = busClassRepository.save(BusClass.builder().className("Non AC Seater").code("Non_AC_Seater").amenities("Fans, Standard Pushback Seats").build());
        busClassRepository.save(BusClass.builder().className("Semi Luxury").code("Semi_Luxury").amenities("Semi-Luxury Expressway Service").build());

        // 4. Seat Types
        seatTypeRepository.save(SeatType.builder().typeName("Standard Seater").code("SEATER").description("Standard Pushback Seat").build());
        seatTypeRepository.save(SeatType.builder().typeName("Sleeper Lower").code("SLEEPER_LOWER").description("Lower Berth Sleeper").build());
        seatTypeRepository.save(SeatType.builder().typeName("Sleeper Upper").code("SLEEPER_UPPER").description("Upper Berth Sleeper").build());

        // 5. Payment Methods
        paymentMethodRepository.save(PaymentMethod.builder().methodName("Credit/Debit Card").code("CARD").isActive(true).build());
        paymentMethodRepository.save(PaymentMethod.builder().methodName("Cash").code("CASH").isActive(true).build());
        paymentMethodRepository.save(PaymentMethod.builder().methodName("Mobile Wallet").code("WALLET").isActive(true).build());

        // 6. Payment Gateways
        paymentGatewayRepository.save(PaymentGateway.builder().gatewayName("Internal Gateway").code("INTERNAL").isActive(true).build());
        paymentGatewayRepository.save(PaymentGateway.builder().gatewayName("Stripe").code("STRIPE").isActive(true).build());
        paymentGatewayRepository.save(PaymentGateway.builder().gatewayName("PayHere").code("PAYHERE").isActive(true).build());

        // 7. Notification Types
        notificationTypeRepository.save(NotificationType.builder().name("Booking Confirmation").code("BOOKING_CONFIRMATION").build());
        notificationTypeRepository.save(NotificationType.builder().name("Seat Cancellation").code("SEAT_CANCELLATION").build());
        notificationTypeRepository.save(NotificationType.builder().name("Trip Update").code("TRIP_UPDATE").build());

        // 8. Provinces & Cities
        Province western = provinceRepository.save(Province.builder().name("Western").code("WP").build());
        Province central = provinceRepository.save(Province.builder().name("Central").code("CP").build());
        Province southern = provinceRepository.save(Province.builder().name("Southern").code("SP").build());
        Province northern = provinceRepository.save(Province.builder().name("Northern").code("NP").build());

        City colomboCity = cityRepository.save(City.builder().cityName("Colombo").province(western).build());
        City kandyCity = cityRepository.save(City.builder().cityName("Kandy").province(central).build());
        City galleCity = cityRepository.save(City.builder().cityName("Galle").province(southern).build());
        City mataraCity = cityRepository.save(City.builder().cityName("Matara").province(southern).build());
        City jaffnaCity = cityRepository.save(City.builder().cityName("Jaffna").province(northern).build());

        // 9. Stations
        Station colombo = stationRepository.save(Station.builder()
                .stationName("Colombo Central Bastian Mawatha")
                .cityEntity(colomboCity)
                .city("Colombo")
                .state("Western")
                .address("Bastian Mawatha, Pettah, Colombo 11")
                .build());

        Station kandy = stationRepository.save(Station.builder()
                .stationName("Kandy Goodshed Bus Stand")
                .cityEntity(kandyCity)
                .city("Kandy")
                .state("Central")
                .address("Goodshed, Kandy City")
                .build());

        Station galle = stationRepository.save(Station.builder()
                .stationName("Galle Central Terminal")
                .cityEntity(galleCity)
                .city("Galle")
                .state("Southern")
                .address("Station Road, Galle")
                .build());

        Station matara = stationRepository.save(Station.builder()
                .stationName("Matara Bus Station")
                .cityEntity(mataraCity)
                .city("Matara")
                .state("Southern")
                .address("Old Tangalle Road, Matara")
                .build());

        Station jaffna = stationRepository.save(Station.builder()
                .stationName("Jaffna Main Bus Terminal")
                .cityEntity(jaffnaCity)
                .city("Jaffna")
                .state("Northern")
                .address("Hospital Road, Jaffna")
                .build());

        // 10. Bus Operators
        BusOperator operator = operatorRepository.save(BusOperator.builder()
                .operatorName("SuperLine Express Lanka")
                .contactPhone("+94112345678")
                .contactEmail("contact@superline.lk")
                .isActive(true)
                .build());

        // 11. Users
        User owner = userRepository.save(User.builder()
                .fullName("System Administrator")
                .email("owner@mybus.com")
                .phoneNumber("+94771234567")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(roleOwner)
                .roleType(UserRole.ROLE_OWNER)
                .build());

        User staff = userRepository.save(User.builder()
                .fullName("Kamal Perera (Driver/Staff)")
                .email("staff@mybus.com")
                .phoneNumber("+94772345678")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(roleStaff)
                .roleType(UserRole.ROLE_STAFF)
                .build());

        User passenger = userRepository.save(User.builder()
                .fullName("Nimal Fernando")
                .email("passenger@mybus.com")
                .phoneNumber("+94773456789")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(rolePassenger)
                .roleType(UserRole.ROLE_PASSENGER)
                .build());

        // 12. Staff Profile
        staffProfileRepository.save(StaffProfile.builder()
                .user(staff)
                .operator(operator)
                .staffType(driverType)
                .employeeCode("EMP-001")
                .licenseNumber("B-883492")
                .isActive(true)
                .build());

        // 13. Routes & Route Stops
        Route r1 = routeRepository.save(Route.builder()
                .originStation(colombo)
                .destinationStation(kandy)
                .routeNumber("EX-01")
                .estimatedDurationMinutes(210)
                .totalDistanceKm(115.5)
                .build());
        routeStopRepository.save(RouteStop.builder().route(r1).station(colombo).stopSequence(1).distanceFromOriginKm(0.0).durationFromOriginMinutes(0).build());
        routeStopRepository.save(RouteStop.builder().route(r1).station(kandy).stopSequence(2).distanceFromOriginKm(115.5).durationFromOriginMinutes(210).build());

        Route r2 = routeRepository.save(Route.builder()
                .originStation(colombo)
                .destinationStation(galle)
                .routeNumber("EX-02")
                .estimatedDurationMinutes(120)
                .totalDistanceKm(125.0)
                .build());
        routeStopRepository.save(RouteStop.builder().route(r2).station(colombo).stopSequence(1).distanceFromOriginKm(0.0).durationFromOriginMinutes(0).build());
        routeStopRepository.save(RouteStop.builder().route(r2).station(galle).stopSequence(2).distanceFromOriginKm(125.0).durationFromOriginMinutes(120).build());

        Route r3 = routeRepository.save(Route.builder()
                .originStation(colombo)
                .destinationStation(jaffna)
                .routeNumber("EX-03")
                .estimatedDurationMinutes(480)
                .totalDistanceKm(395.0)
                .build());
        routeStopRepository.save(RouteStop.builder().route(r3).station(colombo).stopSequence(1).distanceFromOriginKm(0.0).durationFromOriginMinutes(0).build());
        routeStopRepository.save(RouteStop.builder().route(r3).station(jaffna).stopSequence(2).distanceFromOriginKm(395.0).durationFromOriginMinutes(480).build());

        Route r4 = routeRepository.save(Route.builder()
                .originStation(kandy)
                .destinationStation(colombo)
                .routeNumber("EX-04")
                .estimatedDurationMinutes(210)
                .totalDistanceKm(115.5)
                .build());
        routeStopRepository.save(RouteStop.builder().route(r4).station(kandy).stopSequence(1).distanceFromOriginKm(0.0).durationFromOriginMinutes(0).build());
        routeStopRepository.save(RouteStop.builder().route(r4).station(colombo).stopSequence(2).distanceFromOriginKm(115.5).durationFromOriginMinutes(210).build());

        // 14. Buses
        Bus b1 = busRepository.save(Bus.builder()
                .operator(operator)
                .busClassEntity(acSeaterClass)
                .busClass(BusType.AC_Seater)
                .registrationNumber("WP-NC-8821")
                .totalCapacity(40)
                .isActive(true)
                .build());
        fleetService.generateDefaultSeats(b1);

        Bus b2 = busRepository.save(Bus.builder()
                .operator(operator)
                .busClassEntity(acSleeperClass)
                .busClass(BusType.AC_Sleeper)
                .registrationNumber("WP-ND-5510")
                .totalCapacity(30)
                .isActive(true)
                .build());
        fleetService.generateDefaultSeats(b2);

        Bus b3 = busRepository.save(Bus.builder()
                .operator(operator)
                .busClassEntity(nonAcSeaterClass)
                .busClass(BusType.Non_AC_Seater)
                .registrationNumber("SP-NE-2300")
                .totalCapacity(44)
                .isActive(true)
                .build());
        fleetService.generateDefaultSeats(b3);

        // 15. Trips (using TripService to generate TripSeats automatically)
        LocalDateTime now = LocalDateTime.now();

        Trip t1 = tripService.createTrip(TripRequest.builder()
                .busId(b1.getBusId())
                .routeId(r1.getRouteId())
                .departureTime(now.plusHours(2))
                .arrivalTime(now.plusHours(5).plusMinutes(30))
                .baseFare(BigDecimal.valueOf(1450.00))
                .status(TripStatus.scheduled)
                .build());

        Trip t2 = tripService.createTrip(TripRequest.builder()
                .busId(b2.getBusId())
                .routeId(r3.getRouteId())
                .departureTime(now.plusHours(6))
                .arrivalTime(now.plusHours(14))
                .baseFare(BigDecimal.valueOf(3200.00))
                .status(TripStatus.scheduled)
                .build());

        Trip t3 = tripService.createTrip(TripRequest.builder()
                .busId(b3.getBusId())
                .routeId(r2.getRouteId())
                .departureTime(now.plusHours(4))
                .arrivalTime(now.plusHours(6))
                .baseFare(BigDecimal.valueOf(950.00))
                .status(TripStatus.scheduled)
                .build());

        Trip t4 = tripService.createTrip(TripRequest.builder()
                .busId(b1.getBusId())
                .routeId(r4.getRouteId())
                .departureTime(now.plusDays(1).withHour(8).withMinute(0))
                .arrivalTime(now.plusDays(1).withHour(11).withMinute(30))
                .baseFare(BigDecimal.valueOf(1450.00))
                .status(TripStatus.scheduled)
                .build());

        // 16. Seed a sample confirmed booking for passenger on t1
        List<TripSeat> t1Seats = tripSeatRepository.findSeatsByTripId(t1.getTripId());
        if (!t1Seats.isEmpty()) {
            PassengerInfoRequest p1 = new PassengerInfoRequest();
            p1.setSeatId(t1Seats.get(0).getLayoutSeat().getLayoutSeatId());
            p1.setPassengerName("Nimal Fernando");
            p1.setPassengerAge(32);
            p1.setPassengerGender(GenderType.male);
            p1.setBoardingStationId(colombo.getStationId());
            p1.setDroppingStationId(kandy.getStationId());

            CreateBookingRequest bReq = new CreateBookingRequest();
            bReq.setTripId(t1.getTripId());
            bReq.setPassengers(List.of(p1));
            bReq.setPaymentMethod("CARD");

            try {
                bookingService.createBooking(bReq, passenger);
                log.info("Sample booking successfully seeded on trip {}", t1.getTripId());
            } catch (Exception e) {
                log.warn("Sample booking skipped: {}", e.getMessage(), e);
            }
        }

        log.info("Database seeding completed successfully for all ERD entities!");
    }
}
