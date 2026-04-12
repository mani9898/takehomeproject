package com.usds.ecfr.controller;

import com.usds.ecfr.model.AgencyMetrics;
import com.usds.ecfr.model.ecfr.ComparisonResponse;
import com.usds.ecfr.service.EcfrIngestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agencies")
@RequiredArgsConstructor
public class AgencyController {

    private final EcfrIngestionService ingestionService;

    @GetMapping
    public ResponseEntity<List<AgencyMetrics>> getAllAgencies() {
        return ResponseEntity.ok(ingestionService.getAllAgencies());
    }

    @GetMapping("/{id}/metrics")
    public ResponseEntity<AgencyMetrics> getAgencyMetrics(@PathVariable String id) {
        try {
            AgencyMetrics metrics = ingestionService.getAgencyBySlugOrShortName(id);
            if (metrics == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Historical endpoint as requested by plan. For now it returns the historical change count wrapped in an object or just the AgencyMetrics.
    @GetMapping("/{id}/history")
    public ResponseEntity<AgencyMetrics> getAgencyHistory(@PathVariable String id) {
        return getAgencyMetrics(id);
    }

    @GetMapping("/compare")
    public ComparisonResponse compareAgencies(@RequestParam List<String> slugs) {
        return ingestionService.compareAgencies(slugs);
    }
}
