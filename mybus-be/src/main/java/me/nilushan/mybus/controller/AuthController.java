package me.nilushan.mybus.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.request.LoginRequest;
import me.nilushan.mybus.dto.request.RegisterRequest;
import me.nilushan.mybus.dto.response.ApiResponse;
import me.nilushan.mybus.dto.response.AuthResponse;
import me.nilushan.mybus.entity.User;
import me.nilushan.mybus.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Not authenticated"));
        }
        User user = authService.getUserByEmail(userDetails.getUsername());
        AuthResponse response = AuthResponse.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRoleType())
                .build();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
