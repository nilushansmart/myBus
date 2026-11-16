package me.nilushan.mybus.repository;

import me.nilushan.mybus.entity.SeatLayout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeatLayoutRepository extends JpaRepository<SeatLayout, Long> {
    Optional<SeatLayout> findByLayoutName(String layoutName);
}
