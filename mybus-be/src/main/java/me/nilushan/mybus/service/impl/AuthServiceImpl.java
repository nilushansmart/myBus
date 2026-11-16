package me.nilushan.mybus.service.impl;

import lombok.RequiredArgsConstructor;
import me.nilushan.mybus.dto.request.LoginRequest;
import me.nilushan.mybus.dto.request.RegisterRequest;
import me.nilushan.mybus.dto.response.AuthResponse;
import me.nilushan.mybus.entity.Role;
import me.nilushan.mybus.entity.User;
import me.nilushan.mybus.entity.enums.UserRole;
import me.nilushan.mybus.exception.BadRequestException;
import me.nilushan.mybus.exception.ConflictException;
import me.nilushan.mybus.exception.ResourceNotFoundException;
import me.nilushan.mybus.repository.RoleRepository;
import me.nilushan.mybus.repository.UserRepository;
import me.nilushan.mybus.security.JwtTokenProvider;
import me.nilushan.mybus.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email is already registered: " + request.getEmail());
        }
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new ConflictException("Phone number is already in use: " + request.getPhoneNumber());
        }

        UserRole roleType = request.getRole() != null ? request.getRole() : UserRole.ROLE_PASSENGER;
        Role role = roleRepository.findByRoleName(roleType.name()).orElse(null);

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .roleType(roleType)
                .build();

        User savedUser = userRepository.save(user);

        String authority = role != null ? role.getRoleName() : roleType.name();
        String token = tokenProvider.generateToken(savedUser.getEmail(), authority, savedUser.getUserId());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(savedUser.getUserId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .phoneNumber(savedUser.getPhoneNumber())
                .role(savedUser.getRoleType())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        String authority = user.getRole() != null ? user.getRole().getRoleName() : user.getRoleType().name();
        String token = tokenProvider.generateToken(user.getEmail(), authority, user.getUserId());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getUserId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRoleType())
                .build();
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
