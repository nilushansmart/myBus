package me.nilushan.mybus.service;

import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.BusRequest;
import me.nilushan.mybus.entity.Bus;
import me.nilushan.mybus.entity.BusOperator;
import me.nilushan.mybus.entity.Seat;
import me.nilushan.mybus.entity.enums.DeckLevel;
import me.nilushan.mybus.entity.enums.SeatCategory;
import me.nilushan.mybus.repo.BusOperatorRepository;
import me.nilushan.mybus.repo.BusRepository;
import me.nilushan.mybus.repo.SeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FleetService {

    private final BusRepository busRepository;
    private final BusOperatorRepository operatorRepository;
    private final SeatRepository seatRepository;

    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    public Bus getBusById(Long busId) {
        return busRepository.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found with id: " + busId));
    }

    @Transactional
    public Bus createBus(BusRequest request) {
        if (busRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new RuntimeException("Bus with registration number " + request.getRegistrationNumber() + " already exists");
        }

        BusOperator operator = operatorRepository.findById(request.getOperatorId())
                .orElseThrow(() -> new RuntimeException("Operator not found with id: " + request.getOperatorId()));

        Bus bus = Bus.builder()
                .operator(operator)
                .registrationNumber(request.getRegistrationNumber())
                .busClass(request.getBusClass())
                .totalCapacity(request.getTotalCapacity())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        Bus savedBus = busRepository.save(bus);
        generateDefaultSeats(savedBus);
        return savedBus;
    }

    @Transactional
    public Bus updateBus(Long busId, BusRequest request) {
        Bus bus = getBusById(busId);
        BusOperator operator = operatorRepository.findById(request.getOperatorId())
                .orElseThrow(() -> new RuntimeException("Operator not found with id: " + request.getOperatorId()));

        bus.setOperator(operator);
        bus.setRegistrationNumber(request.getRegistrationNumber());
        bus.setBusClass(request.getBusClass());
        bus.setTotalCapacity(request.getTotalCapacity());
        if (request.getIsActive() != null) {
            bus.setIsActive(request.getIsActive());
        }

        return busRepository.save(bus);
    }

    @Transactional
    public void deleteBus(Long busId) {
        if (!busRepository.existsById(busId)) {
            throw new RuntimeException("Bus not found with id: " + busId);
        }
        busRepository.deleteById(busId);
    }

    public List<Seat> getSeatsForBus(Long busId) {
        return seatRepository.findByBusBusIdOrderByDeckAscRowIndexAscColIndexAsc(busId);
    }

    @Transactional
    public void generateDefaultSeats(Bus bus) {
        seatRepository.deleteByBusBusId(bus.getBusId());
        List<Seat> seats = new ArrayList<>();
        int capacity = bus.getTotalCapacity();
        boolean isSleeper = bus.getBusClass().name().contains("Sleeper");

        if (isSleeper) {
            // Split into lower and upper deck
            int perDeck = capacity / 2;
            int rows = (int) Math.ceil(perDeck / 3.0);
            int seatCount = 1;

            // Lower deck (1+2 layout)
            for (int r = 1; r <= rows && seatCount <= perDeck; r++) {
                for (int c = 1; c <= 3 && seatCount <= perDeck; c++) {
                    seats.add(Seat.builder()
                            .bus(bus)
                            .seatNumber("L" + seatCount)
                            .deck(DeckLevel.lower)
                            .seatType(SeatCategory.sleeper)
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
                    seats.add(Seat.builder()
                            .bus(bus)
                            .seatNumber("U" + seatCount)
                            .deck(DeckLevel.upper)
                            .seatType(SeatCategory.sleeper)
                            .rowIndex(r)
                            .colIndex(c)
                            .build());
                    seatCount++;
                }
            }
        } else {
            // Standard 2x2 Seater layout
            int rows = (int) Math.ceil(capacity / 4.0);
            int seatCount = 1;
            for (int r = 1; r <= rows && seatCount <= capacity; r++) {
                for (int c = 1; c <= 4 && seatCount <= capacity; c++) {
                    char colLetter = (char) ('A' + (c - 1));
                    seats.add(Seat.builder()
                            .bus(bus)
                            .seatNumber(r + "" + colLetter)
                            .deck(DeckLevel.lower)
                            .seatType(SeatCategory.seater)
                            .rowIndex(r)
                            .colIndex(c)
                            .build());
                    seatCount++;
                }
            }
        }

        seatRepository.saveAll(seats);
    }

    public List<BusOperator> getAllOperators() {
        return operatorRepository.findAll();
    }

    public BusOperator createOperator(BusOperator operator) {
        return operatorRepository.save(operator);
    }
}
