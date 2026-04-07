package com.project.pgmanagement.controller;

import com.project.pgmanagement.dto.LoginRequest;
import com.project.pgmanagement.dto.SignupRequest;
import com.project.pgmanagement.entity.User;
import com.project.pgmanagement.service.AuthService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public User signup(@RequestBody SignupRequest request) {
        return authService.signup(request.getUser(), request.getCollege());
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return authService.login(request.getEmail(), request.getPassword());
    }
}