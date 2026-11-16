package me.nilushan.mybus.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_gateways")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentGateway {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gateway_id")
    private Long gatewayId;

    @Column(name = "gateway_name", nullable = false, unique = true, length = 50)
    private String gatewayName;

    @Column(name = "code", nullable = false, unique = true, length = 30)
    private String code;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
