package com.example.invento.controller;

import com.example.invento.entity.UserMaster;
import com.example.invento.repository.UserRepository;
import com.example.invento.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public UserMaster addUser(@RequestBody UserMaster user){
        user.setUserType("user");
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserMaster user) {
        UserMaster userMaster = userRepository
                .findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        if (!passwordEncoder.matches(user.getPassword(), userMaster.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }
        if (!userMaster.getUserType().equalsIgnoreCase(user.getUserType())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Invalid user type");
        }
        if(userMaster.getStatus() == 0){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("You're not authorized");
        }
        return ResponseEntity.ok(userMaster);
    }

    @GetMapping("/getUsers")
    public List<UserMaster> getUser(){
        return userRepository.findAll();
    }

    @PutMapping("/updateUserStatus/{id}")
    public UserMaster updateUserStatus(@PathVariable Long id) {
        UserMaster user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(user.getStatus() == 1 ? 0 : 1);
        return userRepository.save(user);
    }

    @PostMapping("/forgotPassword")
    public String sendOtp(@RequestBody Map<String, String> request){
        String email = request.get("email");
        String userType = request.get("user_type");
        Optional<UserMaster> userOpt = userRepository.findByEmailAndUserType(email, userType);
        if (userOpt.isEmpty()){
            return "Email and role do not match";
        }

        String otp = String.valueOf(new Random().nextInt(90000) + 100000);
        UserMaster user = userOpt.get();
        user.setOtp(otp);
        userRepository.save(user);
        emailService.sendOtpEmail(email,"Your OTP for Password Reset", "Your OTP is: " + otp);
        return "OTP Sent Successfully";
    }

    @PutMapping("/resetPassword")
    public UserMaster resetPassword(@RequestBody UserMaster userMaster) {
        UserMaster user = userRepository.findByEmailAndUserType(userMaster.getEmail(), userMaster.getUserType())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(userMaster.getPassword()));
        return userRepository.save(user);
    }

    @PostMapping("/verifyOtp")
    public String verifyOtp(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String userType = request.get("userType");
        String otp = request.get("otp");
        UserMaster user = userRepository
                .findByEmailAndUserTypeAndOtp(email, userType, otp)
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));
        user.setOtp(null);
        userRepository.save(user);
        return "OTP verified successfully";
    }

}
