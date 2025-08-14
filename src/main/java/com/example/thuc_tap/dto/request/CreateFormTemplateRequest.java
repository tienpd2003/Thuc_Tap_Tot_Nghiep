package com.example.thuc_tap.dto.request;

import com.example.thuc_tap.dto.ApprovalWorkflowDto;
import com.example.thuc_tap.dto.FormFieldDto;
import lombok.Data;

import java.util.List;

@Data
public class CreateFormTemplateRequest {
    private String name;
    private String description;
    private Boolean isActive;
    private Long createdById;
    private List<FormFieldDto> formFields;
    private List<ApprovalWorkflowDto> approvalWorkflows;
}
