package com.project.pgmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "application")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Application {
	@PrePersist
	public void prePersist() {
	    this.createdAt = LocalDateTime.now();
	}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tenant_id")
    private User tenant;

    @ManyToOne
    @JoinColumn(name = "pg_id")
    private PG pg;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime createdAt;
}