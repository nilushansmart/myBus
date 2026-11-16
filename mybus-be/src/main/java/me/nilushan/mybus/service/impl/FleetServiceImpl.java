package me.nilushan.mybus.service.impl;

import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.request.BusRequest;
import me.nilushan.mybus.entity.*;
import me.nilushan.mybus.entity.enums.DeckLevel;
import me.nilushan.mybus.entity.enums.SeatCategory;
import me.nilushan.mybus.exception.BadRequestException;
import me.nilushan.mybus.exception.ConflictException;
import me.nilushan.mybus.exception.ResourceNotFoundException;
import me.nilushan.mybus.repository.*;
import me.nilushan.mybus.service.FleetService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FleetServiceImpl implements FleetService {

    private final BusRepository busRepository;
    private final BusOperatorRepository operatorRepository;
    private final BusClassRepository busClassRepository;
    private final SeatLayoutRepository seatLayoutRepository;
    private final LayoutSeatRepository layoutSeatRepository;
    private final SeatTypeRepository seatTypeRepository;
    private final TripRepository tripRepository;

    @Override
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    @Override
    public Bus getBusById(Long busId) {
        return busRepository.findById(busId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + busId));
    }

    @Override
    @Transactional
    public Bus createBus(BusRequest request) {
        if (busRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new ConflictException("Bus with registration number " + request.getRegistrationNumber() + " already exists");
        }

        BusOperator operator = operatorRepository.findById(request.getOperatorId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found with id: " + request.getOperatorId()));

        // Resolve bus class entity
        BusClass busClassEntity = busClassRepository.findByCode(request.getBusClass().name()).orElse(null);

        // Resolve or create layout
        SeatLayout layout = null;
        if (request.getLayoutId() != null) {
            layout = seatLayoutRepository.findById(request.getLayoutId()).orElse(null);
        }

        Bus bus = Bus.builder()
                .operator(operator)
                .busClassEntity(busClassEntity)
                .busClass(request.getBusClass())
                .registrationNumber(request.getRegistrationNumber())
                .totalCapacity(request.getTotalCapacity())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .seatLayout(layout)
                .build();

        Bus savedBus = busRepository.save(bus);

        if (savedBus.getSeatLayout() == null) {
            generateDefaultSeats(savedBus);
        }

        return savedBus;
    }

    @Override
    @Transactional
    public Bus updateBus(Long busId, BusRequest request) {
        Bus bus = getBusById(busId);
        BusOperator operator = operatorRepository.findById(request.getOperatorId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found with id: " + request.getOperatorId()));

        bus.setOperator(operator);
        bus.setRegistrationNumber(request.getRegistrationNumber());
        bus.setBusClass(request.getBusClass());
        busClassRepository.findByCode(request.getBusClass().name()).ifPresent(bus::setBusClassEntity);
        bus.setTotalCapacity(request.getTotalCapacity());
        if (request.getIsActive() != null) {
            bus.setIsActive(request.getIsActive());
        }

        return busRepository.save(bus);
    }

    @Override
    @Transactional
    public void deleteBus(Long busId) {
        if (!busRepository.existsById(busId)) {
            throw new ResourceNotFoundException("Bus not found with id: " + busId);
        }
        if (tripRepository.existsByBusBusId(busId)) {
            throw new BadRequestException("Cannot delete bus because it is currently assigned to scheduled trips. Please reassign or cancel those trips first.");
        }
        Bus bus = busRepository.findById(busId).orElse(null);
        if (bus != null && bus.getSeatLayout() != null) {
            // Delete layout if exclusive
            layoutSeatRepository.deleteBySeatLayoutLayoutId(bus.getSeatLayout().getLayoutId());
            seatLayoutRepository.delete(bus.getSeatLayout());
        }
        busRepository.deleteById(busId);
    }

    @Override
    public List<LayoutSeat> getSeatsForBus(Long busId) {
        Bus bus = getBusById(busId);
        if (bus.getSeatLayout() == null) return new ArrayList<>();
        return layoutSeatRepository.findBySeatLayoutLayoutIdOrderByDeckAscRowIndexAscColIndexAsc(bus.getSeatLayout().getLayoutId());
    }

    @Override
    @Transactional
    public void generateDefaultSeats(Bus bus) {
        SeatLayout layout = bus.getSeatLayout();
        if (layout == null) {
            layout = SeatLayout.builder()
                    .layoutName(bus.getRegistrationNumber() + " Layout (" + bus.getBusClass().name() + ")")
                    .totalCapacity(bus.getTotalCapacity())
                    .totalDecks(bus.getBusClass().name().contains("Sleeper") ? 2 : 1)
                    .build();
            layout = seatLayoutRepository.save(layout);
            bus.setSeatLayout(layout);
            busRepository.save(bus);
        } else {
            layoutSeatRepository.deleteBySeatLayoutLayoutId(layout.getLayoutId());
        }

        List<LayoutSeat> seats = new ArrayList<>();
        int capacity = bus.getTotalCapacity();
        boolean isSleeper = bus.getBusClass().name().contains("Sleeper");

        SeatType seaterType = seatTypeRepository.findByCode("SEATER").orElse(null);
        SeatType sleeperLower = seatTypeRepository.findByCode("SLEEPER_LOWER").orElse(null);
        SeatType sleeperUpper = seatTypeRepository.findByCode("SLEEPER_UPPER").orElse(null);

        if (isSleeper) {
            int perDeck = capacity / 2;
            int rows = (int) Math.ceil(perDeck / 3.0);
            int seatCount = 1;

            // Lower deck (1+2 layout)
            for (int r = 1; r <= rows && seatCount <= perDeck; r++) {
                for (int c = 1; c <= 3 && seatCount <= perDeck; c++) {
                    seats.add(LayoutSeat.builder()
                            .seatLayout(layout)
                            .seatNumber("L" + seatCount)
                            .deck(DeckLevel.lower)
                            .seatType(sleeperLower)
                            .seatCategory(SeatCategory.sleeper)
                            .rowIndex(r)
                            .colIndex(c)
                            .build());
                    seatCount++;
                }
            }

            // Upper deck (1+2 layout)
            seatCount = 1;
            for (int r = 1; r <= rows && seatCount <= (capacity - perDeck); r++) {
                for (int c = 1; c <= 3 && seatCount <= (capacity - perDeck); c++) {
                    seats.add(LayoutSeat.builder()
                            .seatLayout(layout)
                            .seatNumber("U" + seatCount)
                            .deck(DeckLevel.upper)
                            .seatType(sleeperUpper)
                            .seatCategory(SeatCategory.sleeper)
                            .rowIndex(r)
                            .colIndex(c)
                            .build());
                    seatCount++;
                }
            }
        } else {
            int rows = (int) Math.ceil(capacity / 4.0);
            int seatCount = 1;
            for (int r = 1; r <= rows && seatCount <= capacity; r++) {
                for (int c = 1; c <= 4 && seatCount <= capacity; c++) {
                    char colLetter = (char) ('A' + (c - 1));
                    seats.add(LayoutSeat.builder()
                            .seatLayout(layout)
                            .seatNumber(r + "" + colLetter)
                            .deck(DeckLevel.lower)
                            .seatType(seaterType)
                            .seatCategory(SeatCategory.seater)
                            .rowIndex(r)
                            .colIndex(c)
                            .build());
                    seatCount++;
                }
            }
        }

        layoutSeatRepository.saveAll(seats);
    }

    @Override
    public List<BusOperator> getAllOperators() {
        return operatorRepository.findAll();
    }

    @Override
    public BusOperator createOperator(BusOperator operator) {
        return operatorRepository.save(operator);
    }
}
