package me.nilushan.mybus.mapper;

import me.nilushan.mybus.dto.response.TicketResponse;
import me.nilushan.mybus.entity.Ticket;
import org.springframework.stereotype.Component;

@Component
public class TicketMapper {

    public TicketResponse toResponse(Ticket t) {
        if (t == null) return null;

        String seatNum = t.getTripSeat() != null && t.getTripSeat().getLayoutSeat() != null
                ? t.getTripSeat().getLayoutSeat().getSeatNumber()
                : "";

        return TicketResponse.builder()
                .ticketId(t.getTicketId())
                .tripSeatId(t.getTripSeat() != null ? t.getTripSeat().getTripSeatId() : null)
                .seatNumber(seatNum)
                .deck(t.getTripSeat() != null && t.getTripSeat().getLayoutSeat() != null ? t.getTripSeat().getLayoutSeat().getDeck() : null)
                .seatType(t.getTripSeat() != null && t.getTripSeat().getLayoutSeat() != null ? t.getTripSeat().getLayoutSeat().getSeatCategory() : null)
                .passengerName(t.getPassengerName())
                .passengerAge(t.getPassengerAge())
                .passengerGender(t.getPassengerGender())
                .boardingStationName(t.getBoardingStation() != null ? t.getBoardingStation().getStationName() : "")
                .droppingStationName(t.getDroppingStation() != null ? t.getDroppingStation().getStationName() : "")
                .fareAmount(t.getFareAmount())
                .isCheckedIn(t.getIsCheckedIn())
                .checkedInAt(t.getCheckedInAt())
                .build();
    }
}
