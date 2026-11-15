package me.nilushan.mybus.repo;

import me.nilushan.mybus.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByBusBusIdOrderByDeckAscRowIndexAscColIndexAsc(Long busId);
    void deleteByBusBusId(Long busId);
    long countByBusBusId(Long busId);
}
