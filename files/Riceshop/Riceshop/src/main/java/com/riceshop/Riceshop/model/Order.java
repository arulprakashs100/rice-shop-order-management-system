package com.riceshop.Riceshop.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    private String id; // e.g. "GS-89104"

    @Column(nullable = false)
    private LocalDateTime date;

    @Embedded
    private CustomerDetails customer;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items;

    private Double subtotal;

    private Double shipping;

    private Double discount;

    private String couponApplied;

    private Double total;

    private String paymentMethod;

    private String status; // Pending, Packing, Shipped, Delivered, Cancelled
}
