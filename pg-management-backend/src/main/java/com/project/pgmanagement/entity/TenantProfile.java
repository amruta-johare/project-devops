package com.project.pgmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tenant_profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TenantProfile {

    @Id
    private Long userId;

    private String college;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
}