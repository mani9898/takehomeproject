package com.usds.ecfr.repository;

import com.usds.ecfr.model.CrossAgencyEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrossAgencyEventRepository extends JpaRepository<CrossAgencyEvent, Long> {
}
