package com.project.pgmanagement.repository;

import com.project.pgmanagement.entity.Application;
import com.project.pgmanagement.entity.Status;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByTenantId(Long tenantId);

    List<Application> findByPgId(Long pgId);

    boolean existsByTenantIdAndStatus(Long tenantId, com.project.pgmanagement.entity.Status status);
    List<Application> findByStatus(Status status);
}