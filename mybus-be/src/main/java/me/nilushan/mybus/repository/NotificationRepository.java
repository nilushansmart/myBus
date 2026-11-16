package me.nilushan.mybus.repository;

import me.nilushan.mybus.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserUserIdOrderByCreatedAtDesc(String userId);
    List<Notification> findByUserUserIdAndIsReadFalse(String userId);
}
