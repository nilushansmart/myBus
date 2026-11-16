package me.nilushan.mybus.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import me.nilushan.mybus.entity.enums.DeckLevel;
import me.nilushan.mybus.entity.enums.SeatCategory;

@Entity
@Table(name = "layout_seats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"layout_id", "seat_number"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LayoutSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "layout_seat_id")
    private Long layoutSeatId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "layout_id", nullable = false)
    @JsonIgnoreProperties("layoutSeats")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private SeatLayout seatLayout;

    @Column(name = "seat_number", nullable = false, length = 10)
    private String seatNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "deck", nullable = false)
    @Builder.Default
    private DeckLevel deck = DeckLevel.lower;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seat_type_id")
    private SeatType seatType;

    @Enumerated(EnumType.STRING)
    @Column(name = "seat_category")
    @Builder.Default
    private SeatCategory seatCategory = SeatCategory.seater;

    @Column(name = "row_index", nullable = false)
    private Integer rowIndex;

    @Column(name = "col_index", nullable = false)
    private Integer colIndex;
}
