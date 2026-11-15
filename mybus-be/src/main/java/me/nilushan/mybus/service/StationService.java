package me.nilushan.mybus.service;

import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.entity.Station;
import me.nilushan.mybus.repo.StationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StationService {

    private final StationRepository stationRepository;

    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }

    public Station getStationById(Long id) {
        return stationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found with id: " + id));
    }

    public Station createStation(Station station) {
        return stationRepository.save(station);
    }
}
