package com.example.thuc_tap.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketDto {
    
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    private String ticketCode;
    
    @NotNull(message = "Requester ID is required")
    private Long requesterId;
    private String requesterName;
    
    private Long formTemplateId;
    private String formTemplateName;
    
    @NotNull(message = "Department ID is required")
    private Long departmentId;
    private String departmentName;
    
    private Long currentStatusId;
    private String currentStatusName;
    
    private Long priorityId;
    private String priorityName;
    
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private List<TicketFormDataDto> formData;
    private List<TicketApprovalDto> approvals;
}
