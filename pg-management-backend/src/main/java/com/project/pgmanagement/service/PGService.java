package com.project.pgmanagement.service;

import com.project.pgmanagement.entity.*;
import com.project.pgmanagement.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PGService {

    private final PGRepository pgRepo;
    private final UserRepository userRepo;

    public PGService(PGRepository pgRepo, UserRepository userRepo) {
        this.pgRepo = pgRepo;
        this.userRepo = userRepo;
    }
    
    //tenant viewing and filtering pgs
    public List<PG> getPGs(String location, Integer minRent, Integer maxRent, String bhkType) {

        if (location == null) location = "";
        if (bhkType == null) bhkType = "";
        if (minRent == null) minRent = 0;
        if (maxRent == null) maxRent = Integer.MAX_VALUE;

        return pgRepo
            .findByLocationContainingIgnoreCaseAndRentBetweenAndBhkTypeContainingIgnoreCase(
                location,
                minRent,
                maxRent,
                bhkType
            )
            .stream()
            .filter(pg -> pg.getAvailableRooms() > 0) // ALWAYS enforce availability
            .toList();
    }    
    
    // owner gets his pg details
    public List<PG> getMyPGs(String email) {

        User owner = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (owner.getRole() != Role.OWNER) {
            throw new RuntimeException("Only owners allowed");
        }

        return pgRepo.findByOwnerId(owner.getId());
    }
    //owner adding pg
    public PG addPG(PG pg, String ownerEmail) {

        User owner = userRepo.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        //ROLE CHECK
        if (owner.getRole() != Role.OWNER) {
            throw new RuntimeException("Only owners can add PG");
        }

        pg.setOwner(owner);

        return pgRepo.save(pg);
    }
    
    //owner updates pg details
    public PG updatePG(Long id, PG updatedPG, String email) {

        PG existing = pgRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("PG not found"));

        if (!existing.getOwner().getEmail().equals(email)) {
            throw new RuntimeException("Not your PG");
        }

        existing.setName(updatedPG.getName());
        existing.setLocation(updatedPG.getLocation());
        existing.setRent(updatedPG.getRent());
        existing.setBhkType(updatedPG.getBhkType());
        existing.setDescription(updatedPG.getDescription());
        existing.setTotalRooms(updatedPG.getTotalRooms());
        existing.setAvailableRooms(updatedPG.getAvailableRooms());

        return pgRepo.save(existing);
    }
    
    //owner deletes pg
    public void deletePG(Long id, String email) {

        PG pg = pgRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("PG not found"));

        if (!pg.getOwner().getEmail().equals(email)) {
            throw new RuntimeException("Not your PG");
        }

        pgRepo.delete(pg);
    }
}
