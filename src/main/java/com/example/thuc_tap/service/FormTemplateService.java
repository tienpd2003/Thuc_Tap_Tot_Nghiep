package com.example.thuc_tap.service;

import com.example.thuc_tap.dto.request.CreateFormTemplateRequest;
import com.example.thuc_tap.dto.request.FormTemplateFilterRequest;
import com.example.thuc_tap.dto.response.FormTemplateFilterResponse;
import com.example.thuc_tap.dto.response.FormTemplateResponse;
import com.example.thuc_tap.entity.*;
import com.example.thuc_tap.mapper.FormTemplateMapper;
import com.example.thuc_tap.repository.FieldTypeRepository;
import com.example.thuc_tap.repository.FormTemplateRepository;
import com.example.thuc_tap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FormTemplateService {

    private final FormTemplateRepository formTemplateRepository;
    private final FormTemplateMapper formTemplateMapper;
    private final UserRepository userRepository;
    private final FieldTypeRepository fieldTypeRepository;

    public Page<FormTemplateFilterResponse> getAllFormTemplates(FormTemplateFilterRequest filter) {
        Pageable pageable = PageRequest.of(
                filter.getPage(),
                filter.getPageSize(),
                Sort.by(Sort.Direction.fromString(filter.getSortDirection()), filter.getSortBy())
        );

        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

        Page<FormTemplateFilterResponse> responsePage = formTemplateRepository.findByCriteria(
                filter.getKeyword(),
                filter.getIsActive(),
                filter.getCreatedById(),
                filter.getApprovalDepartmentId(),
                filter.getCreatedAtFrom() != null ? LocalDateTime.parse(filter.getCreatedAtFrom(), formatter) : null,
                filter.getCreatedAtTo() != null ? LocalDateTime.parse(filter.getCreatedAtTo(), formatter) : null,
                filter.getUpdatedAtFrom() != null ? LocalDateTime.parse(filter.getUpdatedAtFrom(), formatter) : null,
                filter.getUpdatedAtTo() != null ? LocalDateTime.parse(filter.getUpdatedAtTo(), formatter) : null,
                pageable
        );

        responsePage.getContent().forEach(formTemplate -> {
            List<String> approvalDepartments = formTemplateRepository.findApprovalDepartmentsByFormTemplateId(formTemplate.getId());
            formTemplate.setApprovalDepartments(approvalDepartments);
        });

        return responsePage;
    }

    public FormTemplateResponse getFormTemplateById(Long id) {
        FormTemplate formTemplate = formTemplateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FormTemplate not found with id: " + id));
        return formTemplateMapper.toResponse(formTemplate);
    }

    @Transactional
    public FormTemplateResponse createFormTemplate(CreateFormTemplateRequest request) {
        FormTemplate formTemplate = new FormTemplate();

        formTemplate.setName(request.getName());
        formTemplate.setDescription(request.getDescription());
        formTemplate.setIsActive(request.getIsActive());

        User createdBy = userRepository.findById(request.getCreatedById())
            .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getCreatedById()));

        formTemplate.setCreatedBy(createdBy);

        // Handle form fields and approval workflows
        List<FormField> formFields = request.getFormFields().stream()
            .map(fieldDto -> {
                FormField formField = new FormField();
                formField.setFieldName(fieldDto.getFieldName());
                formField.setFieldLabel(fieldDto.getFieldLabel());

                FieldType fieldType = fieldTypeRepository.findById(fieldDto.getFieldTypeId())
                        .orElseThrow(() -> new RuntimeException("FieldType not found: " + fieldDto.getFieldTypeId()));
                formField.setFieldType(fieldType);
                formField.setIsRequired(fieldDto.getIsRequired());
                formField.setFieldOrder(fieldDto.getFieldOrder());
                formField.setReadOnly(fieldDto.getReadOnly());

                formField.setFieldOptions(fieldDto.getFieldOptions());

                formField.setValidationRules(fieldDto.getValidationRules());
                formField.setFormTemplate(formTemplate);

                return formField;
            })
            .collect(Collectors.toList());
        formTemplate.setFormFields(formFields);

        List<ApprovalWorkflow> approvalWorkflows = request.getApprovalWorkflows().stream()
            .map(workflowDto -> {
                ApprovalWorkflow approvalWorkflow = new ApprovalWorkflow();
                approvalWorkflow.setStepOrder(workflowDto.getStepOrder());

                if (workflowDto.getDepartmentId() != null) {
                    Department department = new Department();
                    department.setId(workflowDto.getDepartmentId());
                    approvalWorkflow.setDepartment(department);
                } else {
                    approvalWorkflow.setDepartment(null);
                }

                approvalWorkflow.setStepName(workflowDto.getStepName());
                approvalWorkflow.setFormTemplate(formTemplate);

                return approvalWorkflow;
            })
            .collect(Collectors.toList());
        formTemplate.setApprovalWorkflows(approvalWorkflows);

        FormTemplate savedFormTemplate = formTemplateRepository.save(formTemplate);

        return formTemplateMapper.toResponse(savedFormTemplate);
    }
}
