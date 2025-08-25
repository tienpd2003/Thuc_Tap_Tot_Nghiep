package com.example.thuc_tap.mapper;

import com.example.thuc_tap.dto.ApprovalWorkflowDto;
import com.example.thuc_tap.dto.FormFieldDto;
//import com.example.thuc_tap.dto.FormTemplateDto;
import com.example.thuc_tap.dto.response.FormTemplateResponse;
import com.example.thuc_tap.entity.ApprovalWorkflow;
import com.example.thuc_tap.entity.FormField;
import com.example.thuc_tap.entity.FormTemplate;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface FormTemplateMapper {

    @Mapping(source = "createdBy.id", target = "createdById")
    @Mapping(source = ".", target = "createdByName", qualifiedByName = "mapCreatedByName")
    @Mapping(source = ".", target = "createdAt", qualifiedByName = "mapCreatedAt")
    @Mapping(source = ".", target = "updatedAt", qualifiedByName = "mapUpdatedAt")
    @Mapping(source = "dueInDays", target = "dueInDays")
    FormTemplateResponse toResponse(FormTemplate formTemplate);

    // @Mapping(source = "fieldType.id", target = "fieldTypeId")
    // @Mapping(source = "fieldType.name", target = "fieldTypeName")
    // FormFieldDto toFormFieldDto(FormField formField);

    // Manual implementation as fallback
    default FormFieldDto toFormFieldDtoManual(FormField formField) {
        if (formField == null) {
            return null;
        }
        
        FormFieldDto dto = new FormFieldDto();
        dto.setFieldName(formField.getFieldName());
        dto.setFieldLabel(formField.getFieldLabel());
        dto.setIsRequired(formField.getIsRequired());
        dto.setFieldOrder(formField.getFieldOrder());
        dto.setReadOnly(formField.getReadOnly());
        dto.setFieldOptions(formField.getFieldOptions());
        dto.setValidationRules(formField.getValidationRules());
        
        if (formField.getFieldType() != null) {
            dto.setFieldTypeId(formField.getFieldType().getId());
            dto.setFieldTypeName(formField.getFieldType().getName());
        }
        
        return dto;
    }

    @Mapping(source = "department.id", target = "departmentId")
    @Mapping(source = "department.name", target = "departmentName")
    @Mapping(source = "approver.id", target = "approverId")
    ApprovalWorkflowDto toApprovalWorkflowDto(ApprovalWorkflow approvalWorkflow);

    @Named("mapCreatedByName")
    default String mapCreatedByName(FormTemplate formTemplate) {
        return formTemplate.getCreatedBy().getFullName() + " (" + formTemplate.getCreatedBy().getUsername() + ")";
    }

    @Named("mapCreatedAt")
    default String mapCreatedAt(FormTemplate formTemplate) {
        return formTemplate.getCreatedAt() != null ? 
            formTemplate.getCreatedAt().format(java.time.format.DateTimeFormatter.ISO_DATE_TIME) : null;
    }

    @Named("mapUpdatedAt")
    default String mapUpdatedAt(FormTemplate formTemplate) {
        return formTemplate.getUpdatedAt() != null ? 
            formTemplate.getUpdatedAt().format(java.time.format.DateTimeFormatter.ISO_DATE_TIME) : null;
    }

}
