package com.example.thuc_tap.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTicketFromTemplateRequest {
    
    @NotNull(message = "Template ID is required")
    private Long templateId;
    
    @NotNull(message = "Requester ID is required")
    private Long requesterId;
    
    // Optional: if null/blank, will fallback to template's name
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    // Form data - key: field key, value: field value
    private Map<String, Object> formData;
    
    // Optional: user-selected priority level id (see PriorityLevel)
    private Long priorityId;

    // Workflow approvers - key: workflow step ID (as string), value: approver user ID (as string)
    // Using String keys to avoid JSON parse errors if FE accidentally sends "null"/"undefined";
    // Backend will parse to Long safely and ignore invalid keys.
    // Can be null or empty if using default workflow behavior
    private Map<String, String> workflowApprovers;
}
