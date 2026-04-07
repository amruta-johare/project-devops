package com.project.pgmanagement.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import com.project.pgmanagement.entity.User;
import com.project.pgmanagement.repository.UserRepository;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
	private UserRepository userRepo;
    public JwtUtil(UserRepository userRepo) {
		super();
		this.userRepo = userRepo;
	}

	private final String SECRET = "mysecretkeymysecretkeymysecretkey"; // min 32 chars
    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

 // In JwtUtil.java
    public String generateToken(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();  // inject UserRepository
        return Jwts.builder()
            .setSubject(email)
            .claim("role", user.getRole().name()) 
            .claim("name", user.getName())
            // ADD THIS LINE
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400000))
            .signWith(key)
            .compact();
     
        
    }

    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}