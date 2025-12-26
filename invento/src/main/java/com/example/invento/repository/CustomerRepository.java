package com.example.invento.repository;

import com.example.invento.entity.CustomerMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<CustomerMaster, Long> {
    List<CustomerMaster> findByUserId(Long userid);
    Optional<CustomerMaster> findByCustomerPhoneAndUserId(String phone, Long userId);
}
