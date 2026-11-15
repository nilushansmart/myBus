package me.nilushan.mybus.service;

import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.RouteRequest;
import me.nilushan.mybus.entity.Route;
import me.nilushan.mybus.entity.RouteStop;
import me.nilushan.mybus.entity.Station;
import me.nilushan.mybus.repo.RouteRepository;
import me.nilushan.mybus.repo.RouteStopRepository;
import me.nilushan.mybus.repo.StationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final RouteRepository routeRepository;
    private final StationRepository stationRepository;
    private final RouteStopRepository routeStopRepository;

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Route getRouteById(Long routeId) {
        return routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found with id: " + routeId));
    }

    @Transactional
    public Route createRoute(RouteRequest request) {
        Station origin = stationRepository.findById(request.getOriginStationId())
                .orElseThrow(() -> new RuntimeException("Origin station not found: " + request.getOriginStationId()));
        Station destination = stationRepository.findById(request.getDestinationStationId())
                .orElseThrow(() -> new RuntimeException("Destination station not found: " + request.getDestinationStationId()));

        Route route = Route.builder()
                .originStation(origin)
                .destinationStation(destination)
                .estimatedDurationMinutes(request.getEstimatedDurationMinutes())
                .totalDistanceKm(request.getTotalDistanceKm())
                .build();

        return routeRepository.save(route);
    }

    @Transactional
    public Route updateRoute(Long routeId, RouteRequest request) {
        Route route = getRouteById(routeId);
        Station origin = stationRepository.findById(request.getOriginStationId())
                .orElseThrow(() -> new RuntimeException("Origin station not found: " + request.getOriginStationId()));
        Station destination = stationRepository.findById(request.getDestinationStationId())
                .orElseThrow(() -> new RuntimeException("Destination station not found: " + request.getDestinationStationId()));

        route.setOriginStation(origin);
        route.setDestinationStation(destination);
        route.setEstimatedDurationMinutes(request.getEstimatedDurationMinutes());
        route.setTotalDistanceKm(request.getTotalDistanceKm());

        return routeRepository.save(route);
    }

    @Transactional
    public void deleteRoute(Long routeId) {
        if (!routeRepository.existsById(routeId)) {
            throw new RuntimeException("Route not found with id: " + routeId);
        }
        routeRepository.deleteById(routeId);
    }

    public List<RouteStop> getStopsForRoute(Long routeId) {
        return routeStopRepository.findByRouteRouteIdOrderByStopSequenceAsc(routeId);
    }
}
