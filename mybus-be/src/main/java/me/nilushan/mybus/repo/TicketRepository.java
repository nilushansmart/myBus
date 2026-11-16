package me.nilushan.mybus.repo;

import me.nilushan.mybus.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByBookingBookingId(Long bookingId);

    @Query("SELECT t FROM Ticket t WHERE t.tripSeat.trip.tripId = :tripId ORDER BY t.tripSeat.seat.seatNumber ASC")
    List<Ticket> findByTripId(@Param("tripId") Long tripId);

    @Query("SELECT t FROM Ticket t WHERE t.booking.bookingReference = :bookingRef")
    List<Ticket> findByBookingReference(@Param("bookingRef") String bookingRef);

    @Query("SELECT t FROM Ticket t WHERE t.tripSeat.trip.tripId = :tripId AND " +
           "(LOWER(t.passengerName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "t.booking.bookingReference LIKE CONCAT('%', :keyword, '%') OR " +
           "t.tripSeat.seat.seatNumber LIKE CONCAT('%', :keyword, '%'))")
    List<Ticket> searchTicketsForTrip(@Param("tripId") Long tripId, @Param("keyword") String keyword);

    @Query("SELECT COUNT(t) > 0 FROM Ticket t WHERE t.tripSeat.trip.tripId = :tripId")
    boolean existsByTripId(@Param("tripId") Long tripId);
}
