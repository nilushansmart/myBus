package me.nilushan.mybus.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "route_stops", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "route_id", "stop_sequence" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteStop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stop_id")
    private Long stopId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    @JsonIgnoreProperties("routeStops")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Route route;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "station_id", nullable = false)
    private Station station;

    @Column(name = "stop_sequence", nullable = false)
    private Integer stopSequence;

    @Column(name = "distance_from_origin_km")
    private Double distanceFromOriginKm;

    @Column(name = "duration_from_origin_minutes")
    private Integer durationFromOriginMinutes;
}
