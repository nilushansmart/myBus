package me.nilushan.mybus.repo;

import me.nilushan.mybus.entity.Trip;
import me.nilushan.mybus.entity.enums.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByStatus(TripStatus status);

    @Query("SELECT t FROM Trip t WHERE t.route.originStation.stationId = :originId " +
           "AND t.route.destinationStation.stationId = :destinationId " +
           "AND t.departureTime BETWEEN :startTime AND :endTime " +
           "AND t.status = :status ORDER BY t.departureTime ASC")
    List<Trip> searchTrips(
            @Param("originId") Long originId,
            @Param("destinationId") Long destinationId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("status") TripStatus status
    );

    @Query("SELECT t FROM Trip t WHERE LOWER(t.route.originStation.city) = LOWER(:originCity) " +
           "AND LOWER(t.route.destinationStation.city) = LOWER(:destinationCity) " +
           "AND t.departureTime >= :startTime " +
           "AND t.status = :status ORDER BY t.departureTime ASC")
    List<Trip> searchTripsByCity(
            @Param("originCity") String originCity,
            @Param("destinationCity") String destinationCity,
            @Param("startTime") LocalDateTime startTime,
            @Param("status") TripStatus status
    );

    List<Trip> findByDepartureTimeAfterOrderByDepartureTimeAsc(LocalDateTime time);
}
