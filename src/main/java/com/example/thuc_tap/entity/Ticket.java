package com.example.thuc_tap.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "ticket_code", nullable = false, unique = true, length = 20)
    private String ticketCode; // TICKET-2024-001
    
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "form_template_id")
    private FormTemplate formTemplate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_status_id", nullable = false)
    private TicketStatus currentStatus;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "priority_id")
    private PriorityLevel priority;
    
    @Column(name = "due_date")
    private LocalDateTime dueDate;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL)
    private List<TicketFormData> ticketFormData;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "form_data", columnDefinition = "jsonb")
    private Map<String, Object> formData;

    /**
     * schema admin
     * {
     *   "id": 1,
     *   "name": "Leave Request",
     *   "formSchema": {
     *     "fields": [
     *       { "key": "reason", "type": "text", "label": "Reason" },
     *       { "key": "fromDate", "type": "date", "label": "From Date" },
     *       { "key": "toDate", "type": "date", "label": "To Date" }
     *     ]
     *   }
     * }
     *
     * formData
     * {
     *   "id": 101,
     *   "ticketCode": "TICKET-2025-001",
     *   "formTemplateId": 1,
     *   "formData": {
     *     "reason": "Family emergency",
     *     "fromDate": "2025-09-01",
     *     "toDate": "2025-09-05"
     *   }
     * }
     *
     * FE render lại thế nào?
     *
     * Khi load ticket → bạn fetch cả FormTemplate (schema) + Ticket (formData).
     *
     * Render: lặp qua formTemplate.formSchema.fields, rồi gán defaultValue = ticket.formData[field.key].
     * **/
    
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL)
    private List<TicketApproval> ticketApprovals;
    
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL)
    private List<Notification> notifications;
    
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL)
    private List<TicketHistory> ticketHistory;
}
