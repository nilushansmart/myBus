package me.nilushan.mybus.service;

import me.nilushan.mybus.dto.request.BusRequest;
import me.nilushan.mybus.entity.Bus;
import me.nilushan.mybus.entity.BusOperator;
import me.nilushan.mybus.entity.LayoutSeat;

import java.util.List;

public interface FleetService {
    List<Bus> getAllBuses();
    Bus getBusById(Long busId);
    Bus createBus(BusRequest request);
    Bus updateBus(Long busId, BusRequest request);
    void deleteBus(Long busId);
    List<LayoutSeat> getSeatsForBus(Long busId);
    void generateDefaultSeats(Bus bus);
    List<BusOperator> getAllOperators();
    BusOperator createOperator(BusOperator operator);
}
