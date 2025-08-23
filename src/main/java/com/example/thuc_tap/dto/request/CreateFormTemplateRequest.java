package com.example.thuc_tap.dto.request;

import com.example.thuc_tap.common.FormSchema;
import com.example.thuc_tap.dto.ApprovalWorkflowDto;
import com.example.thuc_tap.dto.FormFieldDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CreateFormTemplateRequest {
    @NotBlank(message = "Form template name is required")
    @Size(max = 100, message = "Form template name must not exceed 100 characters")
    private String name;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    private Boolean isActive = true;
    
    @NotNull(message = "Created by user ID is required")
    private Long createdById;
    
//    @NotEmpty(message = "Form fields are required")
//    @Valid
//    private List<FormFieldDto> formFields;

    private FormSchema formSchema;
    
    @NotEmpty(message = "Approval workflows are required")
    @Valid
    private List<ApprovalWorkflowDto> approvalWorkflows;
}
