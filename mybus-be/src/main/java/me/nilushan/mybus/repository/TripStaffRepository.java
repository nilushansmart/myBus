package me.nilushan.mybus.repository;

import me.nilushan.mybus.entity.TripStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripStaffRepository extends JpaRepository<TripStaff, Long> {
    List<TripStaff> findByTripTripId(Long tripId);
    List<TripStaff> findByStaffProfileStaffProfileId(Long staffProfileId);
}
