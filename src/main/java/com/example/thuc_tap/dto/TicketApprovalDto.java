package com.example.thuc_tap.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketApprovalDto {
    
    private Long id;
    private Long ticketId;
    private Long approverId;
    private String approverName;
    private Long workflowStepId;
    private String workflowStepName;
    private Integer stepOrder;
    private String stepName;
    private String action;
    private Long statusId;
    private String statusName;
    private String comments;
    private Long departmentId;
    private String departmentName;
    private Long forwardedToDepartmentId;
    private String forwardedToDepartmentName;
    private LocalDateTime createdAt;
}
