package com.example.invento.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "customer_master")
public class CustomerMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Getter
    @Setter
    @Column(name = "customer_name")
    private String customerName;

    @Getter
    @Setter
    @Column(name = "customer_phone")
    private String customerPhone;

    @Getter
    @Setter
    @Column(name = "customer_address")
    private String customerAddress;

    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    @Getter
    @Setter
    private UserMaster user;
}
