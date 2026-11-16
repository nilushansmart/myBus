package me.nilushan.mybus.service;

import me.nilushan.mybus.dto.request.LoginRequest;
import me.nilushan.mybus.dto.request.RegisterRequest;
import me.nilushan.mybus.dto.response.AuthResponse;
import me.nilushan.mybus.entity.User;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    User getUserByEmail(String email);
}
