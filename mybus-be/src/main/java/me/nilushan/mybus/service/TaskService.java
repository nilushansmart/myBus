package me.nilushan.mybus.service;

import me.nilushan.mybus.dto.request.TaskRequest;
import me.nilushan.mybus.dto.response.TaskResponse;
import me.nilushan.mybus.entity.enums.TaskPriority;
import me.nilushan.mybus.entity.enums.TaskStatus;

import java.util.List;

public interface TaskService {

    List<TaskResponse> getAllTasks(TaskStatus status, TaskPriority priority);

    TaskResponse getTaskById(Long id);

    TaskResponse createTask(TaskRequest request);

    TaskResponse updateTask(Long id, TaskRequest request);

    void deleteTask(Long id);

    TaskResponse updateTaskStatus(Long id, TaskStatus status);
}
