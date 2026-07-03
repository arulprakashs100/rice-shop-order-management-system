package com.riceshop.Riceshop.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    private String id; // e.g. "seeraga_samba"

    @Column(nullable = false)
    private String name;

    private String category;

    @Column(length = 1000)
    private String description;

    private String image;

    private Double basePrice;

    private Double rating;

    private Integer reviews;

    private Integer stock;

    private String origin;
}
