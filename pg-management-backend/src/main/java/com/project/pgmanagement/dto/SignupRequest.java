package com.project.pgmanagement.dto;

import com.project.pgmanagement.entity.User;
import lombok.Data;

@Data
public class SignupRequest {
    private User user;
    private String college;
}