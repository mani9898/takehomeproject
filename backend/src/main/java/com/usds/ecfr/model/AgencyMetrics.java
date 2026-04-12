package com.usds.ecfr.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "agency_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgencyMetrics {
    @Id
    @Column(name = "slug", updatable = false, nullable = false)
    private String slug;

    private String shortName;
    private String name;

    private Long wordCount;
    private Integer complexityScore;
    private String checksum;

    private Integer historicalChangesCount; 
    
    private Double stalenessScore; // Average age in years

    @OneToMany(mappedBy = "agencyMetrics", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private java.util.List<AgencyEvent> recentEvents;

    private LocalDateTime lastFetchedAt;
}
