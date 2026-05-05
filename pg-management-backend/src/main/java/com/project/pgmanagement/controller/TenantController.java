package com.project.pgmanagement.controller;

import com.project.pgmanagement.entity.User;
import com.project.pgmanagement.service.TenantService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.security.Principal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/tenants")
public class TenantController {

    private final TenantService tenantService;

    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    //View available tenants
    @GetMapping("/available")
    public List<User> getAvailableTenants(
            @RequestParam(required = false) String college,
            Principal principal) {

        return tenantService.getAvailableTenants(college);
    }
}