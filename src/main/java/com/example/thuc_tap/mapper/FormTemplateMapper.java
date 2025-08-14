package com.example.thuc_tap.mapper;

import com.example.thuc_tap.dto.ApprovalWorkflowDto;
import com.example.thuc_tap.dto.FormFieldDto;
import com.example.thuc_tap.dto.FormTemplateDto;
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
    @Mapping(source = "createdAt", target = "createdAt", dateFormat = "dd/MM/yyyy HH:mm")
    @Mapping(source = "updatedAt", target = "updatedAt", dateFormat = "dd/MM/yyyy HH:mm")
    FormTemplateDto toResponse(FormTemplate formTemplate);

    @Mapping(source = "fieldType.id", target = "fieldTypeId")
    @Mapping(source = "fieldType.name", target = "fieldTypeName")
    FormFieldDto toFormFieldDto(FormField formField);

    @Mapping(source = "department.id", target = "departmentId")
    ApprovalWorkflowDto toApprovalWorkflowDto(ApprovalWorkflow approvalWorkflow);

    @Named("mapCreatedByName")
    default String mapCreatedByName(FormTemplate formTemplate) {
        return formTemplate.getCreatedBy().getFullName() + " (" + formTemplate.getCreatedBy().getUsername() + ")";
    }

}
