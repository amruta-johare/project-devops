package com.project.pgmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pg")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PG {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private int rent;
    private String bhkType;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int totalRooms;
    private int availableRooms;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
    
    @ManyToMany
    @JoinTable(
        name = "pg_facility",
        joinColumns = @JoinColumn(name = "pg_id"),
        inverseJoinColumns = @JoinColumn(name = "facility_id")
    )
    private java.util.List<Facility> facilities;
}