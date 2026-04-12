package com.usds.ecfr.repository;

import com.usds.ecfr.model.AgencyMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AgencyMetricsRepository extends JpaRepository<AgencyMetrics, String> {
    Optional<AgencyMetrics> findByShortNameIgnoreCase(String shortName);
}
