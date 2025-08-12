package com.example.thuc_tap.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "ticket_status")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketStatus {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name; // PENDING, APPROVED, REJECTED, IN_PROGRESS
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    // Relationships
    @OneToMany(mappedBy = "currentStatus", cascade = CascadeType.ALL)
    private List<Ticket> tickets;
    
    @OneToMany(mappedBy = "status", cascade = CascadeType.ALL)
    private List<TicketApproval> ticketApprovals;
}
