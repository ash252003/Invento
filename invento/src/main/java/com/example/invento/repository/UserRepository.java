package com.example.invento.repository;

import com.example.invento.entity.UserMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserMaster, Long> {
    Optional<UserMaster> findByEmail(String email);
    Optional<UserMaster> findByEmailAndUserType(String email, String userType);
    Optional<UserMaster> findByEmailAndUserTypeAndOtp(
            String email,
            String user_type,
            String otp
    );

}
