package me.nilushan.mybus.repository;

import me.nilushan.mybus.entity.Task;
import me.nilushan.mybus.entity.enums.TaskPriority;
import me.nilushan.mybus.entity.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByStatus(TaskStatus status);

    List<Task> findByPriority(TaskPriority priority);

    List<Task> findByStatusAndPriority(TaskStatus status, TaskPriority priority);

    List<Task> findByTitleContainingIgnoreCase(String keyword);
}
