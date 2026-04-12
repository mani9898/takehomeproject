package com.usds.ecfr.model.ecfr;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AgenciesResponse(List<Agency> agencies) {
    
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Agency(
        String name,
        String short_name,
        String slug,
        List<CfrReference> cfr_references
    ) {}
    
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record CfrReference(
        Integer title,
        String chapter
    ) {}
}
