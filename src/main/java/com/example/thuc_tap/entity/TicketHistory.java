package com.example.thuc_tap.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "action_by_user_id")
    private User actionByUser;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private TicketHistoryAction actionType;
    
    @Column(name = "action_description", columnDefinition = "TEXT")
    private String actionDescription;
    
    @Column(name = "from_status")
    private String fromStatus;
    
    @Column(name = "to_status")
    private String toStatus;
    
    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    public enum TicketHistoryAction {
        CREATED,           // Ticket được tạo
        APPROVED,          // Ticket được duyệt
        REJECTED,          // Ticket bị từ chối
        FORWARDED,         // Ticket được chuyển tiếp
        STATUS_CHANGED,    // Trạng thái thay đổi
        COMMENTED          // Thêm comment
    }
}
