package com.project.pgmanagement.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping("/secure")
    public String secureEndpoint() {
        return "You are authenticated!";
    }
}