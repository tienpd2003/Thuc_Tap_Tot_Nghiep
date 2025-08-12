package com.example.thuc_tap.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "priority_levels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PriorityLevel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name; // LOW, MEDIUM, HIGH, URGENT
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    // Relationships
    @OneToMany(mappedBy = "priority", cascade = CascadeType.ALL)
    private List<Ticket> tickets;
}
