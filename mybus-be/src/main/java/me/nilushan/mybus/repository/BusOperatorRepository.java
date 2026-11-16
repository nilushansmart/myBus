package me.nilushan.mybus.repository;

import me.nilushan.mybus.entity.BusOperator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusOperatorRepository extends JpaRepository<BusOperator, Long> {
    List<BusOperator> findByIsActiveTrue();
}
