package me.nilushan.mybus.service.impl;

import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.entity.Station;
import me.nilushan.mybus.exception.ResourceNotFoundException;
import me.nilushan.mybus.repository.StationRepository;
import me.nilushan.mybus.service.StationService;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
@RequiredArgsConstructor
public class StationServiceImpl implements StationService {

    private final StationRepository stationRepository;

    @Override
    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }

    @Override
    public Station getStationById(Long id) {
        return stationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Station not found with id: " + id));
    }

    @Override
    public Station createStation(Station station) {
        return stationRepository.save(station);
    }
}
