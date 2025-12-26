package com.example.invento.controller;

import com.example.invento.entity.UserMaster;
import com.example.invento.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public UserMaster addUser(@RequestBody UserMaster user){
        user.setUser_type("user");
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
        if (!userMaster.getUser_type().equalsIgnoreCase(user.getUser_type())) {
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


}
