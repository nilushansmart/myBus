package me.nilushan.mybus.service.impl;

import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.request.RouteRequest;
import me.nilushan.mybus.entity.Route;
import me.nilushan.mybus.entity.RouteStop;
import me.nilushan.mybus.entity.Station;
import me.nilushan.mybus.exception.BadRequestException;
import me.nilushan.mybus.exception.ResourceNotFoundException;
import me.nilushan.mybus.repository.RouteRepository;
import me.nilushan.mybus.repository.RouteStopRepository;
import me.nilushan.mybus.repository.StationRepository;
import me.nilushan.mybus.repository.TripRepository;
import me.nilushan.mybus.service.RouteService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteServiceImpl implements RouteService {

    private final RouteRepository routeRepository;
    private final StationRepository stationRepository;
    private final RouteStopRepository routeStopRepository;
    private final TripRepository tripRepository;

    @Override
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    @Override
    public Route getRouteById(Long routeId) {
        return routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + routeId));
    }

    @Override
    @Transactional
    public Route createRoute(RouteRequest request) {
        Station origin = stationRepository.findById(request.getOriginStationId())
                .orElseThrow(() -> new ResourceNotFoundException("Origin station not found: " + request.getOriginStationId()));
        Station destination = stationRepository.findById(request.getDestinationStationId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination station not found: " + request.getDestinationStationId()));

        String routeNum = request.getRouteNumber() != null && !request.getRouteNumber().isBlank()
                ? request.getRouteNumber()
                : "R-" + origin.getCity().substring(0, Math.min(3, origin.getCity().length())).toUpperCase() + "-" + destination.getCity().substring(0, Math.min(3, destination.getCity().length())).toUpperCase();

        Route route = Route.builder()
                .routeNumber(routeNum)
                .originStation(origin)
                .destinationStation(destination)
                .estimatedDurationMinutes(request.getEstimatedDurationMinutes())
                .totalDistanceKm(request.getTotalDistanceKm())
                .build();

        Route savedRoute = routeRepository.save(route);

        // Create origin and destination route stops by default
        RouteStop originStop = RouteStop.builder()
                .route(savedRoute)
                .station(origin)
                .stopSequence(1)
                .distanceFromOriginKm(0.0)
                .durationFromOriginMinutes(0)
                .build();

        RouteStop destStop = RouteStop.builder()
                .route(savedRoute)
                .station(destination)
                .stopSequence(2)
                .distanceFromOriginKm(request.getTotalDistanceKm())
                .durationFromOriginMinutes(request.getEstimatedDurationMinutes())
                .build();

        routeStopRepository.save(originStop);
        routeStopRepository.save(destStop);

        return savedRoute;
    }

    @Override
    @Transactional
    public Route updateRoute(Long routeId, RouteRequest request) {
        Route route = getRouteById(routeId);
        Station origin = stationRepository.findById(request.getOriginStationId())
                .orElseThrow(() -> new ResourceNotFoundException("Origin station not found: " + request.getOriginStationId()));
        Station destination = stationRepository.findById(request.getDestinationStationId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination station not found: " + request.getDestinationStationId()));

        route.setOriginStation(origin);
        route.setDestinationStation(destination);
        route.setEstimatedDurationMinutes(request.getEstimatedDurationMinutes());
        route.setTotalDistanceKm(request.getTotalDistanceKm());
        if (request.getRouteNumber() != null) {
            route.setRouteNumber(request.getRouteNumber());
        }

        return routeRepository.save(route);
    }

    @Override
    @Transactional
    public void deleteRoute(Long routeId) {
        if (!routeRepository.existsById(routeId)) {
            throw new ResourceNotFoundException("Route not found with id: " + routeId);
        }
        if (tripRepository.existsByRouteRouteId(routeId)) {
            throw new BadRequestException("Cannot delete route because trips are scheduled on it. Please remove or cancel those trips first.");
        }
        routeStopRepository.deleteByRouteRouteId(routeId);
        routeRepository.deleteById(routeId);
    }

    @Override
    public List<RouteStop> getStopsForRoute(Long routeId) {
        return routeStopRepository.findByRouteRouteIdOrderByStopSequenceAsc(routeId);
    }
}
