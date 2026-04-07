package com.project.pgmanagement.service;

import com.project.pgmanagement.entity.*;
import com.project.pgmanagement.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TenantService {

    private final UserRepository userRepo;
    private final ApplicationRepository appRepo;

    public TenantService(UserRepository userRepo, ApplicationRepository appRepo) {
        this.userRepo = userRepo;
        this.appRepo = appRepo;
    }

    // Get available tenants
    public List<User> getAvailableTenants(String college) {

        // Step 1: get all tenants
        List<User> tenants = userRepo.findByRole(Role.TENANT);

        // Step 2: find booked tenants
        Set<Long> bookedTenantIds = appRepo.findByStatus(Status.APPROVED)
                .stream()
                .map(app -> app.getTenant().getId())
                .collect(Collectors.toSet());

        // Step 3: filter
        return tenants.stream()
                .filter(t -> !bookedTenantIds.contains(t.getId()))
                .filter(t -> college == null || 
                        t.getTenantProfile().getCollege().equalsIgnoreCase(college))
                .toList();
    }
}