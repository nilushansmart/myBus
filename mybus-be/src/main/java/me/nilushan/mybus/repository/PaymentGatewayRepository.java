package me.nilushan.mybus.repository;

import me.nilushan.mybus.entity.PaymentGateway;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentGatewayRepository extends JpaRepository<PaymentGateway, Long> {
    Optional<PaymentGateway> findByCode(String code);
}
