package me.nilushan.mybus.service;

import me.nilushan.mybus.dto.request.TaskRequest;
import me.nilushan.mybus.dto.response.TaskResponse;
import me.nilushan.mybus.entity.Task;
import me.nilushan.mybus.entity.enums.TaskPriority;
import me.nilushan.mybus.entity.enums.TaskStatus;
import me.nilushan.mybus.exception.TaskNotFoundException;
import me.nilushan.mybus.mapper.TaskMapper;
import me.nilushan.mybus.repository.TaskRepository;
import me.nilushan.mybus.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @Spy
    private TaskMapper taskMapper = new TaskMapper();

    @InjectMocks
    private TaskServiceImpl taskService;

    private Task sampleTask;
    private TaskRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleTask = Task.builder()
                .id(1L)
                .title("Complete Backend Redesign")
                .description("Redesign architecture according to ERD")
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.HIGH)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        sampleRequest = TaskRequest.builder()
                .title("Complete Backend Redesign")
                .description("Redesign architecture according to ERD")
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.HIGH)
                .build();
    }

    @Test
    @DisplayName("createTask should successfully persist task and return response")
    void createTask_Success() {
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);

        TaskResponse response = taskService.createTask(sampleRequest);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("Complete Backend Redesign");
        assertThat(response.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
        assertThat(response.getPriority()).isEqualTo(TaskPriority.HIGH);

        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("getTaskById should return task response when task exists")
    void getTaskById_Success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));

        TaskResponse response = taskService.getTaskById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("Complete Backend Redesign");
        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("getTaskById should throw TaskNotFoundException when task does not exist")
    void getTaskById_NotFound() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTaskById(99L))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessageContaining("Task not found with id: 99");

        verify(taskRepository, times(1)).findById(99L);
    }

    @Test
    @DisplayName("getAllTasks with no filters should return all tasks")
    void getAllTasks_NoFilter() {
        when(taskRepository.findAll()).thenReturn(List.of(sampleTask));

        List<TaskResponse> responses = taskService.getAllTasks(null, null);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getTitle()).isEqualTo(sampleTask.getTitle());
        verify(taskRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAllTasks with both status and priority should filter by both")
    void getAllTasks_FilterByStatusAndPriority() {
        when(taskRepository.findByStatusAndPriority(TaskStatus.IN_PROGRESS, TaskPriority.HIGH))
                .thenReturn(List.of(sampleTask));

        List<TaskResponse> responses = taskService.getAllTasks(TaskStatus.IN_PROGRESS, TaskPriority.HIGH);

        assertThat(responses).hasSize(1);
        verify(taskRepository, times(1)).findByStatusAndPriority(TaskStatus.IN_PROGRESS, TaskPriority.HIGH);
    }

    @Test
    @DisplayName("getAllTasks with status filter only should filter by status")
    void getAllTasks_FilterByStatusOnly() {
        when(taskRepository.findByStatus(TaskStatus.IN_PROGRESS))
                .thenReturn(List.of(sampleTask));

        List<TaskResponse> responses = taskService.getAllTasks(TaskStatus.IN_PROGRESS, null);

        assertThat(responses).hasSize(1);
        verify(taskRepository, times(1)).findByStatus(TaskStatus.IN_PROGRESS);
    }

    @Test
    @DisplayName("getAllTasks with priority filter only should filter by priority")
    void getAllTasks_FilterByPriorityOnly() {
        when(taskRepository.findByPriority(TaskPriority.HIGH))
                .thenReturn(List.of(sampleTask));

        List<TaskResponse> responses = taskService.getAllTasks(null, TaskPriority.HIGH);

        assertThat(responses).hasSize(1);
        verify(taskRepository, times(1)).findByPriority(TaskPriority.HIGH);
    }

    @Test
    @DisplayName("updateTask should modify existing task fields and return updated response")
    void updateTask_Success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TaskRequest updateRequest = TaskRequest.builder()
                .title("Updated Task Title")
                .description("Updated description")
                .status(TaskStatus.COMPLETED)
                .priority(TaskPriority.LOW)
                .build();

        TaskResponse updated = taskService.updateTask(1L, updateRequest);

        assertThat(updated).isNotNull();
        assertThat(updated.getTitle()).isEqualTo("Updated Task Title");
        assertThat(updated.getStatus()).isEqualTo(TaskStatus.COMPLETED);
        assertThat(updated.getPriority()).isEqualTo(TaskPriority.LOW);

        verify(taskRepository, times(1)).findById(1L);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("updateTask should throw TaskNotFoundException when task does not exist")
    void updateTask_NotFound() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.updateTask(99L, sampleRequest))
                .isInstanceOf(TaskNotFoundException.class);

        verify(taskRepository, times(1)).findById(99L);
        verify(taskRepository, never()).save(any());
    }

    @Test
    @DisplayName("deleteTask should delete task when it exists")
    void deleteTask_Success() {
        when(taskRepository.existsById(1L)).thenReturn(true);
        doNothing().when(taskRepository).deleteById(1L);

        taskService.deleteTask(1L);

        verify(taskRepository, times(1)).existsById(1L);
        verify(taskRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("deleteTask should throw TaskNotFoundException when task does not exist")
    void deleteTask_NotFound() {
        when(taskRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> taskService.deleteTask(99L))
                .isInstanceOf(TaskNotFoundException.class);

        verify(taskRepository, times(1)).existsById(99L);
        verify(taskRepository, never()).deleteById(any());
    }

    @Test
    @DisplayName("updateTaskStatus should change status and save task")
    void updateTaskStatus_Success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);

        TaskResponse response = taskService.updateTaskStatus(1L, TaskStatus.COMPLETED);

        assertThat(response).isNotNull();
        assertThat(sampleTask.getStatus()).isEqualTo(TaskStatus.COMPLETED);

        verify(taskRepository, times(1)).findById(1L);
        verify(taskRepository, times(1)).save(sampleTask);
    }

    @Test
    @DisplayName("updateTaskStatus should throw TaskNotFoundException when task does not exist")
    void updateTaskStatus_NotFound() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.updateTaskStatus(99L, TaskStatus.COMPLETED))
                .isInstanceOf(TaskNotFoundException.class);

        verify(taskRepository, times(1)).findById(99L);
        verify(taskRepository, never()).save(any());
    }
}
