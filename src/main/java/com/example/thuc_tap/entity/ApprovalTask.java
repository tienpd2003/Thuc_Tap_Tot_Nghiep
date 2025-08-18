package com.example.thuc_tap.entity;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "approval_tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ApprovalTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ApprovalTaskStatus status; // e.g., PENDING, APPROVED, REJECTED

    @Column(name = "step_index", nullable = false)
    private Integer stepIndex;

    @Column(name = "approver_role", length = 255)
    private String approverRole;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id")
    private User approver;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_step_id")
    private ApprovalWorkflow workflowStep;

    @Column(name = "workflow_instance_id")
    private Long workflowInstanceId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "meta", columnDefinition = "jsonb")
    private JsonNode meta;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "acted_at")
    private LocalDateTime actedAt;

    @Column(name = "timeout_at")
    private LocalDateTime timeoutAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;
}
