package com.example.invento.repository;

import com.example.invento.entity.ProductMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<ProductMaster, Long> {
    List<ProductMaster> findByUserId(Long userid);
    Optional<ProductMaster> findByIdAndUserId(Long userid, Long id);
    void deleteByIdAndUserId(Long id, Long userid);
}
