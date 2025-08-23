package com.example.thuc_tap.dto;

import com.example.thuc_tap.common.FormSchema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormTemplateDto {

    private Long id;
    private String name;
    private String description;
    private Boolean isActive;
    private Long createdById;
    private String createdByName;
    private String createdAt;
    private String updatedAt;
//    private List<FormFieldDto> formFields;
    private FormSchema formSchema;
    private List<ApprovalWorkflowDto> approvalWorkflows;

}
