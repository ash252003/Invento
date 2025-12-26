package com.example.invento.controller;

import com.example.invento.entity.CustomerMaster;
import com.example.invento.entity.UserMaster;
import com.example.invento.repository.CustomerRepository;
import com.example.invento.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CustomerController {

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/addOrUpdateCustomer/{userId}")
    public CustomerMaster addOrUpdateCustomer(
            @PathVariable Long userId,
            @RequestBody CustomerMaster customer
    ) {
        UserMaster user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return customerRepository.findByCustomerPhoneAndUserId(customer.getCustomerPhone(), userId)
                .map(existing -> {
                    existing.setCustomerName(customer.getCustomerName());
                    existing.setCustomerAddress(customer.getCustomerAddress());
                    return customerRepository.save(existing);
                })
                .orElseGet(() -> {
                    customer.setUser(user);
                    return customerRepository.save(customer);
                });
    }

    @GetMapping("/getCustomer/{id}")
    public List<CustomerMaster> getCustomer(@PathVariable Long id){
        return customerRepository.findByUserId(id);
    }
}
