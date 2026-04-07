package com.project.pgmanagement.controller;

import com.project.pgmanagement.entity.PG;
import com.project.pgmanagement.service.PGService;

import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/pg")
public class PGController {

    private final PGService pgService;

    public PGController(PGService pgService) {
        this.pgService = pgService;
    }

    // OWNER: add PG
    @PostMapping
    public PG addPG(@RequestBody PG pg, Principal principal) {
        return pgService.addPG(pg, principal.getName());
    }

    // TENANT: view available PGs
    @GetMapping
    public List<PG> getPGs(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minRent,
            @RequestParam(required = false) Integer maxRent,
            @RequestParam(required = false) String bhkType
    ) {
        return pgService.getPGs(location, minRent, maxRent, bhkType);
    }

    // OWNER: view own PGs
    @GetMapping("/my")
    public List<PG> getMyPGs(Principal principal) {
        return pgService.getMyPGs(principal.getName());
    }

    // OWNER: update PG
    @PutMapping("/{id}")
    public PG updatePG(@PathVariable Long id,
                       @RequestBody PG pg,
                       Principal principal) {
        return pgService.updatePG(id, pg, principal.getName());
    }

    // OWNER: delete PG
    @DeleteMapping("/{id}")
    public void deletePG(@PathVariable Long id,
                         Principal principal) {
        pgService.deletePG(id, principal.getName());
    }
}