package me.nilushan.mybus.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "refunds")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Refund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refund_id")
    private Long refundId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    @JsonIgnoreProperties("refunds")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Payment payment;

    @Column(name = "refund_reference", nullable = false, unique = true, length = 64)
    private String refundReference;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "reason")
    private String reason;

    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private String status = "COMPLETED";

    @Column(name = "refunded_at")
    private LocalDateTime refundedAt;

    @PrePersist
    public void prePersist() {
        if (refundedAt == null) refundedAt = LocalDateTime.now();
        if (status == null) status = "COMPLETED";
    }
}
