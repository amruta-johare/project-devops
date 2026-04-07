package com.project.pgmanagement.repository;

import com.project.pgmanagement.entity.PG;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PGRepository extends JpaRepository<PG, Long> {
	List<PG> findByLocationContainingIgnoreCaseAndRentBetweenAndBhkTypeContainingIgnoreCase(
            String location, 
            Integer minRent, 
            Integer maxRent, 
            String bhkType
    );
	List<PG> findByOwnerId(Long ownerId);
}