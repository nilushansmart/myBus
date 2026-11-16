package me.nilushan.mybus.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "seat_layouts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatLayout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "layout_id")
    private Long layoutId;

    @Column(name = "layout_name", nullable = false, length = 100)
    private String layoutName;

    @Column(name = "total_capacity", nullable = false)
    private Integer totalCapacity;

    @Column(name = "total_decks", nullable = false)
    @Builder.Default
    private Integer totalDecks = 1;

    @Column(name = "rows_per_deck")
    private Integer rowsPerDeck;

    @Column(name = "cols_per_row")
    private Integer colsPerRow;

    @OneToMany(mappedBy = "seatLayout", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("seatLayout")
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<LayoutSeat> layoutSeats = new ArrayList<>();
}
