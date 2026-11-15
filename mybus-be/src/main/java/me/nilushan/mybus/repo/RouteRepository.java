package me.nilushan.mybus.repo;

import me.nilushan.mybus.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    Optional<Route> findByOriginStationStationIdAndDestinationStationStationId(Long originId, Long destId);
    List<Route> findByOriginStationCityIgnoreCaseAndDestinationStationCityIgnoreCase(String originCity, String destCity);
}
