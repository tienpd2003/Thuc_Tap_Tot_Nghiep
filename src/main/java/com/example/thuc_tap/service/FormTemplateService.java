package com.example.thuc_tap.service;

import com.example.thuc_tap.dto.FormTemplateDto;
import com.example.thuc_tap.dto.FormFieldDto;
import com.example.thuc_tap.controller.FormTemplateController.FieldTypeDto;
import com.example.thuc_tap.entity.*;
import com.example.thuc_tap.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service xử lý form templates động
 */
@Service
@Transactional
public class FormTemplateService {

    @Autowired
    private FormTemplateRepository formTemplateRepository;

    @Autowired
    private FormFieldRepository formFieldRepository;

    @Autowired
    private FieldTypeRepository fieldTypeRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Lấy danh sách form templates đang hoạt động
     */
    public List<FormTemplateDto> getAllActiveFormTemplates() {
        List<FormTemplate> templates = formTemplateRepository.findByIsActive(true);
        return templates.stream().map(this::convertToDto).toList();
    }

    /**
     * Lấy chi tiết form template
     */
    public Optional<FormTemplateDto> getFormTemplateById(Long formTemplateId) {
        return formTemplateRepository.findById(formTemplateId).map(this::convertToDto);
    }

    /**
     * Lấy danh sách fields của form template
     */
    public List<FormFieldDto> getFormFields(Long formTemplateId) {
        List<FormField> fields = formFieldRepository.findByFormTemplateIdOrderByFieldOrder(formTemplateId);
        return fields.stream().map(this::convertFieldToDto).toList();
    }

    /**
     * Tạo form template mới
     */
    public FormTemplateDto createFormTemplate(FormTemplateDto formTemplateDto) {
        User createdBy = userRepository.findById(formTemplateDto.getCreatedById())
                .orElseThrow(() -> new RuntimeException("User not found"));

        FormTemplate template = new FormTemplate();
        template.setName(formTemplateDto.getName());
        template.setDescription(formTemplateDto.getDescription());
        template.setIsActive(true);
        template.setCreatedBy(createdBy);

        FormTemplate savedTemplate = formTemplateRepository.save(template);
        return convertToDto(savedTemplate);
    }

    /**
     * Thêm field vào form template
     */
    public FormFieldDto addFieldToTemplate(Long formTemplateId, FormFieldDto formFieldDto) {
        FormTemplate template = formTemplateRepository.findById(formTemplateId)
                .orElseThrow(() -> new RuntimeException("Form template not found"));

        FieldType fieldType = fieldTypeRepository.findById(formFieldDto.getFieldTypeId())
                .orElseThrow(() -> new RuntimeException("Field type not found"));

        // Check if field name already exists in this template
        if (formFieldRepository.existsByFormTemplateIdAndFieldName(formTemplateId, formFieldDto.getFieldName())) {
            throw new RuntimeException("Field name already exists in this template");
        }

        FormField field = new FormField();
        field.setFormTemplate(template);
        field.setFieldName(formFieldDto.getFieldName());
        field.setFieldLabel(formFieldDto.getFieldLabel());
        field.setFieldType(fieldType);
        field.setIsRequired(formFieldDto.getIsRequired());
        field.setFieldOrder(formFieldDto.getFieldOrder());
        // Note: fieldOptions and validationRules need JSON conversion
        // For now, we'll set them as null or handle them later
        field.setFieldOptions(null);
        field.setValidationRules(null);

        FormField savedField = formFieldRepository.save(field);
        return convertFieldToDto(savedField);
    }

    /**
     * Cập nhật field
     */
    public Optional<FormFieldDto> updateFormField(Long fieldId, FormFieldDto formFieldDto) {
        return formFieldRepository.findById(fieldId).map(field -> {
            field.setFieldLabel(formFieldDto.getFieldLabel());
            field.setIsRequired(formFieldDto.getIsRequired());
            field.setFieldOrder(formFieldDto.getFieldOrder());
            // Note: fieldOptions and validationRules need JSON conversion
            // For now, we'll keep existing values or set them as null
            // field.setFieldOptions(null);
            // field.setValidationRules(null);

            // Update field type if changed
            if (formFieldDto.getFieldTypeId() != null) {
                FieldType fieldType = fieldTypeRepository.findById(formFieldDto.getFieldTypeId())
                        .orElseThrow(() -> new RuntimeException("Field type not found"));
                field.setFieldType(fieldType);
            }

            FormField savedField = formFieldRepository.save(field);
            return convertFieldToDto(savedField);
        });
    }

    /**
     * Xóa field
     */
    public boolean deleteFormField(Long fieldId) {
        if (formFieldRepository.existsById(fieldId)) {
            formFieldRepository.deleteById(fieldId);
            return true;
        }
        return false;
    }

    /**
     * Lấy danh sách field types
     */
    public List<FieldTypeDto> getAllFieldTypes() {
        List<FieldType> fieldTypes = fieldTypeRepository.findAll();
        return fieldTypes.stream()
                .map(ft -> new FieldTypeDto(ft.getId(), ft.getName(), ft.getDescription()))
                .toList();
    }

    /**
     * Convert FormTemplate Entity to DTO
     */
    private FormTemplateDto convertToDto(FormTemplate template) {
        FormTemplateDto dto = new FormTemplateDto();
        dto.setId(template.getId());
        dto.setName(template.getName());
        dto.setDescription(template.getDescription());
        dto.setIsActive(template.getIsActive());
        dto.setCreatedById(template.getCreatedBy().getId());
        dto.setCreatedByName(template.getCreatedBy().getFullName());
        dto.setCreatedAt(template.getCreatedAt() != null ? template.getCreatedAt().toString() : null);
        dto.setUpdatedAt(template.getUpdatedAt() != null ? template.getUpdatedAt().toString() : null);
        return dto;
    }

    /**
     * Convert FormField Entity to DTO
     */
    private FormFieldDto convertFieldToDto(FormField field) {
        FormFieldDto dto = new FormFieldDto();
        dto.setFieldName(field.getFieldName());
        dto.setFieldLabel(field.getFieldLabel());
        dto.setFieldTypeId(field.getFieldType().getId());
        dto.setFieldTypeName(field.getFieldType().getName());
        dto.setIsRequired(field.getIsRequired());
        dto.setFieldOrder(field.getFieldOrder());
        
        // Convert JSON string to appropriate types if needed
        // For now, we'll skip fieldOptions and validationRules conversion
        // as they need special handling for JSON conversion
        
        return dto;
    }
}