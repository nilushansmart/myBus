package me.nilushan.mybus.repository;

import me.nilushan.mybus.entity.Booking;
import me.nilushan.mybus.entity.enums.BookingStatusType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingReference(String bookingReference);
    List<Booking> findByUserUserIdOrderByBookedAtDesc(String userId);
    List<Booking> findAllByOrderByBookedAtDesc();

    long countByBookingStatus(BookingStatusType status);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.bookingStatus = :status")
    BigDecimal sumTotalAmountByStatus(@Param("status") BookingStatusType status);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b")
    BigDecimal sumTotalRevenue();
}
