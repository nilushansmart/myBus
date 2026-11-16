package me.nilushan.mybus.repository;

import me.nilushan.mybus.entity.Trip;
import me.nilushan.mybus.entity.enums.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByStatus(TripStatus status);
    List<Trip> findByDepartureTimeAfterOrderByDepartureTimeAsc(LocalDateTime time);
    boolean existsByBusBusId(Long busId);
    boolean existsByRouteRouteId(Long routeId);
}
