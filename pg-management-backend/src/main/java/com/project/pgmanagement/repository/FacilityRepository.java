package com.project.pgmanagement.repository;

import com.project.pgmanagement.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacilityRepository extends JpaRepository<Facility, Long> {
}