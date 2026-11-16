package me.nilushan.mybus.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import me.nilushan.mybus.dto.request.TaskRequest;
import me.nilushan.mybus.dto.response.TaskResponse;
import me.nilushan.mybus.entity.enums.TaskPriority;
import me.nilushan.mybus.entity.enums.TaskStatus;
import me.nilushan.mybus.exception.TaskNotFoundException;
import me.nilushan.mybus.security.CustomUserDetailsService;
import me.nilushan.mybus.security.JwtTokenProvider;
import me.nilushan.mybus.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = TaskController.class)
@AutoConfigureMockMvc(addFilters = false)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private TaskService taskService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    private TaskResponse sampleResponse;
    private TaskRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleResponse = TaskResponse.builder()
                .id(1L)
                .title("Build Task Manager Slice")
                .description("Complete vertical slice and tests")
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.HIGH)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        sampleRequest = TaskRequest.builder()
                .title("Build Task Manager Slice")
                .description("Complete vertical slice and tests")
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.HIGH)
                .build();
    }

    @Test
    @DisplayName("GET /api/tasks should return list of tasks with 200 OK")
    void getAllTasks_ReturnsListAnd200() throws Exception {
        when(taskService.getAllTasks(null, null)).thenReturn(List.of(sampleResponse));

        mockMvc.perform(get("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].id", is(1)))
                .andExpect(jsonPath("$.data[0].title", is("Build Task Manager Slice")));

        verify(taskService, times(1)).getAllTasks(null, null);
    }

    @Test
    @DisplayName("GET /api/tasks/{id} should return task with 200 OK when found")
    void getTaskById_Found_Returns200() throws Exception {
        when(taskService.getTaskById(1L)).thenReturn(sampleResponse);

        mockMvc.perform(get("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", is(1)))
                .andExpect(jsonPath("$.data.title", is("Build Task Manager Slice")));

        verify(taskService, times(1)).getTaskById(1L);
    }

    @Test
    @DisplayName("GET /api/tasks/{id} should return 404 NOT FOUND when task doesn't exist")
    void getTaskById_NotFound_Returns404() throws Exception {
        when(taskService.getTaskById(99L)).thenThrow(new TaskNotFoundException(99L));

        mockMvc.perform(get("/api/tasks/99")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("Task not found with id: 99")));

        verify(taskService, times(1)).getTaskById(99L);
    }

    @Test
    @DisplayName("POST /api/tasks with valid body should return 201 CREATED")
    void createTask_ValidPayload_Returns201() throws Exception {
        when(taskService.createTask(any(TaskRequest.class))).thenReturn(sampleResponse);

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", is("Task created successfully")))
                .andExpect(jsonPath("$.data.id", is(1)))
                .andExpect(jsonPath("$.data.title", is("Build Task Manager Slice")));

        verify(taskService, times(1)).createTask(any(TaskRequest.class));
    }

    @Test
    @DisplayName("POST /api/tasks with blank title should return 400 BAD REQUEST")
    void createTask_InvalidPayload_Returns400() throws Exception {
        TaskRequest invalidRequest = TaskRequest.builder()
                .title("") // Blank title violates @NotBlank
                .description("No title")
                .build();

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)));

        verify(taskService, never()).createTask(any());
    }

    @Test
    @DisplayName("PUT /api/tasks/{id} with valid body should return 200 OK")
    void updateTask_ValidPayload_Returns200() throws Exception {
        when(taskService.updateTask(eq(1L), any(TaskRequest.class))).thenReturn(sampleResponse);

        mockMvc.perform(put("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", is("Task updated successfully")))
                .andExpect(jsonPath("$.data.id", is(1)));

        verify(taskService, times(1)).updateTask(eq(1L), any(TaskRequest.class));
    }

    @Test
    @DisplayName("DELETE /api/tasks/{id} should return 200 OK")
    void deleteTask_Returns200() throws Exception {
        doNothing().when(taskService).deleteTask(1L);

        mockMvc.perform(delete("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", is("Task deleted successfully")));

        verify(taskService, times(1)).deleteTask(1L);
    }

    @Test
    @DisplayName("PATCH /api/tasks/{id}/status should return 200 OK")
    void updateTaskStatus_Returns200() throws Exception {
        sampleResponse.setStatus(TaskStatus.COMPLETED);
        when(taskService.updateTaskStatus(1L, TaskStatus.COMPLETED)).thenReturn(sampleResponse);

        mockMvc.perform(patch("/api/tasks/1/status")
                        .param("status", "COMPLETED")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("COMPLETED")));

        verify(taskService, times(1)).updateTaskStatus(1L, TaskStatus.COMPLETED);
    }
}
