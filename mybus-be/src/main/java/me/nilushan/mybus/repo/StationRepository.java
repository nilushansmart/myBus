package me.nilushan.mybus.repo;

import me.nilushan.mybus.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {
    List<Station> findByCityIgnoreCase(String city);
    List<Station> findByStationNameContainingIgnoreCase(String name);
}
