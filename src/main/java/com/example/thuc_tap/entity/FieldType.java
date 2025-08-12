package com.example.thuc_tap.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "field_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FieldType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name; // TEXT, NUMBER, DATE, FILE, SELECT, TEXTAREA
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    // Relationships
    @OneToMany(mappedBy = "fieldType", cascade = CascadeType.ALL)
    private List<FormField> formFields;
}
