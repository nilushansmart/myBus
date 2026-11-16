package me.nilushan.mybus.service;

import me.nilushan.mybus.entity.Station;

import java.util.List;

public interface StationService {
    List<Station> getAllStations();
    Station getStationById(Long id);
    Station createStation(Station station);
}
