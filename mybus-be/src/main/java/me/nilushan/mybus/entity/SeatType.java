package me.nilushan.mybus.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seat_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_type_id")
    private Long seatTypeId;

    @Column(name = "type_name", nullable = false, unique = true, length = 50)
    private String typeName;

    @Column(name = "code", nullable = false, unique = true, length = 30)
    private String code;

    @Column(name = "description")
    private String description;
}
