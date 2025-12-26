package com.example.invento.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "transaction_item")
@Getter
@Setter
public class TransactionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;

    @Column(name = "selling_price", nullable = false)
    private Long sellingPrice;

    // 🔗 Many items belong to one transaction
    @ManyToOne
    @JoinColumn(name = "transaction_id", nullable = false)
    @JsonIgnore
    private TransactionMaster transaction;

    // 🔗 Each item refers to one product
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private ProductMaster product;
}
