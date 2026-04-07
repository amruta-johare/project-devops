package com.project.pgmanagement.controller;

import com.project.pgmanagement.entity.Application;
import com.project.pgmanagement.service.ApplicationService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.security.Principal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService service;

    public ApplicationController(ApplicationService service) {
        this.service = service;
    }

    // TENANT: Apply to PG
    @PostMapping("/{pgId}")
    public Application apply(@PathVariable Long pgId, Principal principal) {
        return service.apply(pgId, principal.getName());
    }

    // TENANT: View own applications
    @GetMapping("/my")
    public List<Application> myApplications(Principal principal) {
        return service.getMyApplications(principal.getName());
    }

    // OWNER: View applicants for a PG
    @GetMapping("/pg/{pgId}")
    public List<Application> applicants(@PathVariable Long pgId, Principal principal) {
        return service.getApplicants(pgId, principal.getName());
    }

    // OWNER: Approve / Reject
    @PutMapping("/{appId}")
    public Application updateStatus(@PathVariable Long appId,
                                   @RequestParam String status,
                                   Principal principal) {
        return service.updateStatus(appId, status, principal.getName());
    }
}