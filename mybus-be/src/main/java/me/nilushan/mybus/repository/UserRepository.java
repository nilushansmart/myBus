package me.nilushan.mybus.repository;

import me.nilushan.mybus.entity.User;
import me.nilushan.mybus.entity.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    List<User> findAllByRoleRoleName(String roleName);
    List<User> findAllByRoleType(UserRole roleType);
}
