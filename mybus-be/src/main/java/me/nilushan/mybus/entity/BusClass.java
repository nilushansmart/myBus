package me.nilushan.mybus.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bus_classes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bus_class_id")
    private Long busClassId;

    @Column(name = "class_name", nullable = false, unique = true, length = 50)
    private String className;

    @Column(name = "code", nullable = false, unique = true, length = 30)
    private String code;

    @Column(name = "amenities")
    private String amenities;

    @Column(name = "description")
    private String description;
}
