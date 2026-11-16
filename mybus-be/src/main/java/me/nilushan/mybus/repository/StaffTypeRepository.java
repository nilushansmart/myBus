package me.nilushan.mybus.repository;

import me.nilushan.mybus.entity.StaffType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffTypeRepository extends JpaRepository<StaffType, Long> {
    Optional<StaffType> findByCode(String code);
}
