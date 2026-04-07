package com.project.pgmanagement.repository;

import com.project.pgmanagement.entity.TenantProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantProfileRepository extends JpaRepository<TenantProfile, Long> {
}