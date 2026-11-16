package me.nilushan.mybus.mapper;

import me.nilushan.mybus.dto.request.TaskRequest;
import me.nilushan.mybus.dto.response.TaskResponse;
import me.nilushan.mybus.entity.Task;
import me.nilushan.mybus.entity.enums.TaskPriority;
import me.nilushan.mybus.entity.enums.TaskStatus;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TaskMapper {

    public Task toEntity(TaskRequest request) {
        if (request == null) return null;

        return Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.PENDING)
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .build();
    }

    public TaskResponse toResponse(Task task) {
        if (task == null) return null;

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(Task task, TaskRequest request) {
        if (task == null || request == null) return;

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
    }

    public List<TaskResponse> toResponseList(List<Task> tasks) {
        if (tasks == null) return Collections.emptyList();
        return tasks.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
