package me.nilushan.mybus.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.nilushan.mybus.entity.enums.DeckLevel;
import me.nilushan.mybus.entity.enums.GenderType;
import me.nilushan.mybus.entity.enums.SeatCategory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponse {
    private Long ticketId;
    private Long tripSeatId;
    private String seatNumber;
    private DeckLevel deck;
    private SeatCategory seatType;
    private String passengerName;
    private Integer passengerAge;
    private GenderType passengerGender;
    private String boardingStationName;
    private String droppingStationName;
    private BigDecimal fareAmount;
    private Boolean isCheckedIn;
    private LocalDateTime checkedInAt;
}
