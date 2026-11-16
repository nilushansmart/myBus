package me.nilushan.mybus.repository;

import me.nilushan.mybus.entity.BusClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusClassRepository extends JpaRepository<BusClass, Long> {
    Optional<BusClass> findByCode(String code);
}
