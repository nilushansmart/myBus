package me.nilushan.mybus.repository;

import me.nilushan.mybus.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    Optional<Bus> findByRegistrationNumber(String registrationNumber);
    boolean existsByRegistrationNumber(String registrationNumber);
    List<Bus> findByOperatorOperatorId(Long operatorId);
    List<Bus> findByIsActiveTrue();
}
