package me.nilushan.mybus.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notification_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "type_id")
    private Long typeId;

    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name;

    @Column(name = "code", nullable = false, unique = true, length = 30)
    private String code;
}
