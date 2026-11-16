package me.nilushan.mybus.repository;

import me.nilushan.mybus.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findByOriginStationStationIdAndDestinationStationStationId(Long originId, Long destinationId);
}
