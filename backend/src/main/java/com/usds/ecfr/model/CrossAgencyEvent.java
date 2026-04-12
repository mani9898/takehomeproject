package com.usds.ecfr.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "cross_agency_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrossAgencyEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate amendmentDate;

    // Comma-separated list of agency slugs that collided on this date
    @Column(nullable = false)
    private String involvedAgencies;

    private String description;
}
