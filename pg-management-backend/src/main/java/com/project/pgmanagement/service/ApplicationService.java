package com.project.pgmanagement.service;

import com.project.pgmanagement.entity.*;
import com.project.pgmanagement.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository appRepo;
    private final UserRepository userRepo;
    private final PGRepository pgRepo;

    public ApplicationService(ApplicationRepository appRepo,
                              UserRepository userRepo,
                              PGRepository pgRepo) {
        this.appRepo = appRepo;
        this.userRepo = userRepo;
        this.pgRepo = pgRepo;
    }

    // TENANT: Apply
    public Application apply(Long pgId, String email) {

        User tenant = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (tenant.getRole() != Role.TENANT) {
            throw new RuntimeException("Only tenants can apply");
        }

        // Already booked check
        boolean alreadyBooked = appRepo.existsByTenantIdAndStatus(tenant.getId(), Status.APPROVED);
        if (alreadyBooked) {
            throw new RuntimeException("You already have a confirmed PG");
        }

        PG pg = pgRepo.findById(pgId)
                .orElseThrow(() -> new RuntimeException("PG not found"));

        // No rooms available
        if (pg.getAvailableRooms() <= 0) {
            throw new RuntimeException("No rooms available");
        }

        Application app = new Application();
        app.setTenant(tenant);
        app.setPg(pg);
        app.setStatus(Status.PENDING);

        return appRepo.save(app);
    }

    // TENANT: View own
    public List<Application> getMyApplications(String email) {

        User tenant = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (tenant.getRole() != Role.TENANT) {
            throw new RuntimeException("Only tenants allowed");
        }

        return appRepo.findByTenantId(tenant.getId());
    }

    // OWNER: View applicants
    public List<Application> getApplicants(Long pgId, String email) {

        User owner = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PG pg = pgRepo.findById(pgId)
                .orElseThrow(() -> new RuntimeException("PG not found"));

        if (!pg.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Not your PG");
        }

        return appRepo.findByPgId(pgId);
    }

    // OWNER: Approve / Reject
    public Application updateStatus(Long appId, String status, String email) {

        Application app = appRepo.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        User owner = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PG pg = app.getPg();

        // Not owner
        if (!pg.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Not authorized");
        }

        Status newStatus = Status.valueOf(status.toUpperCase());

        // IMPORTANT LOGIC: APPROVE
        if (newStatus == Status.APPROVED) {

            // No rooms left
            if (pg.getAvailableRooms() <= 0) {
                throw new RuntimeException("No rooms available");
            }

            // Already approved before
            if (app.getStatus() == Status.APPROVED) {
                throw new RuntimeException("Already approved");
            }

            // decrease room
            pg.setAvailableRooms(pg.getAvailableRooms() - 1);
            pgRepo.save(pg);
        }

        app.setStatus(newStatus);
        return appRepo.save(app);
    }
}