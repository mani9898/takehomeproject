package com.usds.ecfr.model.ecfr;

import com.usds.ecfr.model.AgencyMetrics;
import com.usds.ecfr.model.CrossAgencyEvent;
import lombok.Data;
import java.util.List;

@Data
public class ComparisonResponse {
    private List<AgencyMetrics> metrics;
    private List<CrossAgencyEvent> correlations;

    public ComparisonResponse(List<AgencyMetrics> metrics, List<CrossAgencyEvent> correlations) {
        this.metrics = metrics;
        this.correlations = correlations;
    }
}
