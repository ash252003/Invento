package com.example.invento.repository;

import com.example.invento.entity.TransactionMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<TransactionMaster, Long> {
    List<TransactionMaster> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate);
}
