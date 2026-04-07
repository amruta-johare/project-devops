// package com.project.pgmanagement.config;

// import com.project.pgmanagement.util.JwtUtil;
// import com.project.pgmanagement.repository.UserRepository;

// import jakarta.servlet.*;
// import jakarta.servlet.http.*;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.stereotype.Component;

// import java.io.IOException;
// import java.util.ArrayList;

// @Component
// public class JwtFilter extends GenericFilter {

//     private final JwtUtil jwtUtil;
//     private final UserRepository userRepo;

//     public JwtFilter(JwtUtil jwtUtil, UserRepository userRepo) {
//         this.jwtUtil = jwtUtil;
//         this.userRepo = userRepo;
//     }

//     @Override
//     public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
//             throws IOException, ServletException {

//         HttpServletRequest req = (HttpServletRequest) request;

//         String path = req.getRequestURI();

//         // Skip auth endpoints
//         if (path.startsWith("/auth")) {
//             chain.doFilter(request, response);
//             return;
//         }

//         String authHeader = req.getHeader("Authorization");

//         if (authHeader != null && authHeader.startsWith("Bearer ")) {
//             try {
//                 String token = authHeader.substring(7);
//                 String email = jwtUtil.extractEmail(token);

//                 if (email != null && userRepo.findByEmail(email).isPresent()) {
                    
//                     // THE FIX: Tell Spring Security the user is authenticated!
//                     UsernamePasswordAuthenticationToken authToken = 
//                         new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
                        
//                     SecurityContextHolder.getContext().setAuthentication(authToken);
//                 }

//             } catch (Exception e) {
//                 // Don't crash — just ignore invalid token
//                 System.out.println("Invalid JWT: " + e.getMessage());
//             }
//         }

//         chain.doFilter(request, response);
//     }
// }

package com.project.pgmanagement.config;

import com.project.pgmanagement.util.JwtUtil;
import com.project.pgmanagement.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtFilter extends jakarta.servlet.GenericFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepo;

    public JwtFilter(JwtUtil jwtUtil, UserRepository userRepo) {
        this.jwtUtil = jwtUtil;
        this.userRepo = userRepo;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;

        // ✅ VERY IMPORTANT → allow preflight (CORS fix)
        if (req.getMethod().equalsIgnoreCase("OPTIONS")) {
            chain.doFilter(request, response);
            return;
        }

        String path = req.getRequestURI();

        // ✅ allow auth routes without JWT
        if (path.startsWith("/auth")) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = req.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                String email = jwtUtil.extractEmail(token);

                if (email != null && userRepo.findByEmail(email).isPresent()) {

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }

            } catch (Exception e) {
                System.out.println("Invalid JWT: " + e.getMessage());
            }
        }

        chain.doFilter(request, response);
    }
}