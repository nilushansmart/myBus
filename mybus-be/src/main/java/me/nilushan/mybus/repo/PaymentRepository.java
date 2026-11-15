package me.nilushan.mybus.repo;

import me.nilushan.mybus.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBookingBookingId(Long bookingId);
    Optional<Payment> findByTransactionReference(String transactionReference);
}
