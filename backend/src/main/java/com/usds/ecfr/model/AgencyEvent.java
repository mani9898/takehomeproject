package com.usds.ecfr.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "agency_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgencyEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private String identifier;
    private LocalDate amendmentDate;
    private LocalDate issueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agency_slug", nullable = false)
    @JsonIgnore
    private AgencyMetrics agencyMetrics;
}
