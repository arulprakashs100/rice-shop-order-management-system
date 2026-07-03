package com.riceshop.Riceshop.model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDetails {
    private String name;
    private String phone;
    private String address;
}
