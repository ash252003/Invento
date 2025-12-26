package com.example.invento.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "transaction_master")
public class TransactionMaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Getter
    @Setter
    @Column(nullable = false)
    private LocalDate transactionDate;

    @Getter
    @Setter
    private Long amount;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    @Getter
    @Setter
    private CustomerMaster customer;

    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    @Getter
    @Setter
    private UserMaster user;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, orphanRemoval = true)
    @Getter
    @Setter
    private List<TransactionItem> items;
}
