package me.nilushan.mybus.service;

import me.nilushan.mybus.dto.request.RouteRequest;
import me.nilushan.mybus.entity.Route;
import me.nilushan.mybus.entity.RouteStop;

import java.util.List;

public interface RouteService {
    List<Route> getAllRoutes();

    Route getRouteById(Long routeId);

    Route createRoute(RouteRequest request);

    Route updateRoute(Long routeId, RouteRequest request);

    void deleteRoute(Long routeId);

    List<RouteStop> getStopsForRoute(Long routeId);
}
