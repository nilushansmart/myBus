package me.nilushan.mybus.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "staff_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "staff_type_id")
    private Long staffTypeId;

    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name;

    @Column(name = "code", nullable = false, unique = true, length = 30)
    private String code;

    @Column(name = "description")
    private String description;
}
