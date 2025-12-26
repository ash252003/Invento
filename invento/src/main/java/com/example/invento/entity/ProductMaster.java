package com.example.invento.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "product_master")
public class ProductMaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private String product_name;

    @Getter
    @Setter
    private String product_category;

    @Getter
    @Setter
    private int product_quantity;

    @Getter
    @Setter
    private int product_cost_price;

    @Getter
    @Setter
    private int product_selling_price;

    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    @Getter
    @Setter
    private UserMaster user;
}
