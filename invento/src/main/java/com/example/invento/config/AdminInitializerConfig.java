package com.example.invento.config;

import com.example.invento.entity.UserMaster;
import com.example.invento.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AdminInitializerConfig {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner createDefaultAdmin(UserRepository userRepository){
        return args -> {
            if(userRepository.findByEmail("admin@invento.com").isEmpty()){
                UserMaster userMaster = new UserMaster();
                userMaster.setEmail("admin@invento.com");
                userMaster.setPassword(passwordEncoder.encode("admin123"));
                userMaster.setPhone("9999999999");
                userMaster.setUser_type("admin");
                userMaster.setStatus(0);
                userRepository.save(userMaster);
            }
        };
    }

}
