package me.nilushan.mybus.repository;

import me.nilushan.mybus.entity.SeatLock;
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
public interface SeatLockRepository extends JpaRepository<SeatLock, Long> {
    Optional<SeatLock> findByTripSeatTripSeatId(Long tripSeatId);
    List<SeatLock> findByUserUserId(String userId);

    @Transactional
    @Modifying
    @Query("DELETE FROM SeatLock sl WHERE sl.lockedUntil < :now")
    int deleteExpiredLocks(@Param("now") LocalDateTime now);

    @Transactional
    @Modifying
    @Query("DELETE FROM SeatLock sl WHERE sl.tripSeat.tripSeatId IN :tripSeatIds")
    void deleteByTripSeatIds(@Param("tripSeatIds") List<Long> tripSeatIds);
}
