package me.nilushan.mybus.repository;

import me.nilushan.mybus.entity.StaffProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffProfileRepository extends JpaRepository<StaffProfile, Long> {
    Optional<StaffProfile> findByUserUserId(String userId);
    List<StaffProfile> findByOperatorOperatorId(Long operatorId);
    boolean existsByUserUserId(String userId);
}
