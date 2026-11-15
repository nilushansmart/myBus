package me.nilushan.mybus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.nilushan.mybus.entity.enums.DeckLevel;
import me.nilushan.mybus.entity.enums.SeatCategory;
import me.nilushan.mybus.entity.enums.SeatReservationStatus;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatDto {
    private Long tripSeatId;
    private Long seatId;
    private String seatNumber;
    private DeckLevel deck;
    private SeatCategory seatType;
    private Integer rowIndex;
    private Integer colIndex;
    private SeatReservationStatus status;
    private LocalDateTime lockedUntil;
    private String lockedByUserId;
}
