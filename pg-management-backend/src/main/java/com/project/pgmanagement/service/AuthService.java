package com.project.pgmanagement.service;

import com.project.pgmanagement.entity.*;
import com.project.pgmanagement.repository.*;
import com.project.pgmanagement.util.JwtUtil;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final TenantProfileRepository tenantRepo;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    
    public AuthService(UserRepository userRepo, TenantProfileRepository tenantRepo, BCryptPasswordEncoder encoder,
			JwtUtil jwtUtil) {
		super();
		this.userRepo = userRepo;
		this.tenantRepo = tenantRepo;
		this.encoder = encoder;
		this.jwtUtil = jwtUtil;
	}

    public User signup(User user, String college) {

        user.setPassword(encoder.encode(user.getPassword()));
        User savedUser = userRepo.save(user);

        if (user.getRole() == Role.TENANT) {
            TenantProfile tp = new TenantProfile();
            tp.setUser(savedUser);
            tp.setCollege(college);
            tenantRepo.save(tp);
        }

        return savedUser;
    }

    public String login(String email, String password) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(user.getEmail());
    }
}