package me.nilushan.mybus.repo;

import me.nilushan.mybus.entity.TripSeat;
import me.nilushan.mybus.entity.enums.SeatReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TripSeatRepository extends JpaRepository<TripSeat, Long> {
    @Query("SELECT ts FROM TripSeat ts WHERE ts.trip.tripId = :tripId ORDER BY ts.seat.deck ASC, ts.seat.rowIndex ASC, ts.seat.colIndex ASC")
    List<TripSeat> findSeatsByTripId(@Param("tripId") Long tripId);
    
    Optional<TripSeat> findByTripTripIdAndSeatSeatId(Long tripId, Long seatId);

    List<TripSeat> findByTripTripIdAndStatus(Long tripId, SeatReservationStatus status);

    @Query("SELECT ts FROM TripSeat ts WHERE ts.trip.tripId = :tripId AND ts.seat.seatId IN :seatIds")
    List<TripSeat> findByTripTripIdAndSeatIds(@Param("tripId") Long tripId, @Param("seatIds") List<Long> seatIds);

    @Transactional
    @Modifying
    @Query("UPDATE TripSeat ts SET ts.status = 'available', ts.lockedUntil = null, ts.lockedByUser = null " +
           "WHERE ts.status = 'locked' AND ts.lockedUntil < :now")
    int releaseExpiredLocks(@Param("now") LocalDateTime now);

    @Transactional
    @Modifying
    @Query("DELETE FROM TripSeat ts WHERE ts.trip.tripId = :tripId")
    void deleteByTripId(@Param("tripId") Long tripId);
}
