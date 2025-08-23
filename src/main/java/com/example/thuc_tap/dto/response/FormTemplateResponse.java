package com.example.thuc_tap.dto.response;

import com.example.thuc_tap.common.FormSchema;
import com.example.thuc_tap.dto.ApprovalWorkflowDto;
import com.example.thuc_tap.dto.FormFieldDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormTemplateResponse {

    private Long id;
    private String name;
    private String description;
    private Boolean isActive;
    private Long createdById;
    private String createdByName;
    private String createdAt;
    private String updatedAt;
    private List<FormFieldDto> formFields;
    private FormSchema formSchema;
    private List<ApprovalWorkflowDto> approvalWorkflows;

}
