package me.nilushan.mybus.repository;

import me.nilushan.mybus.entity.LayoutSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LayoutSeatRepository extends JpaRepository<LayoutSeat, Long> {
    List<LayoutSeat> findBySeatLayoutLayoutIdOrderByDeckAscRowIndexAscColIndexAsc(Long layoutId);
    void deleteBySeatLayoutLayoutId(Long layoutId);
}
