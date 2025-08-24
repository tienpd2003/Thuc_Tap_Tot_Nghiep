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
    FormTemplateResponse toResponse(FormTemplate formTemplate);

    @Mapping(source = "fieldType.id", target = "fieldTypeId")
    @Mapping(source = "fieldType.name", target = "fieldTypeName")
    FormFieldDto toFormFieldDto(FormField formField);

    @Mapping(source = "department.id", target = "departmentId")
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
