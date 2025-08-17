package com.example.thuc_tap.controller;

import com.example.thuc_tap.dto.FormTemplateDto;
import com.example.thuc_tap.dto.FormFieldDto;
import com.example.thuc_tap.service.FormTemplateService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller xử lý form templates động
 */
@RestController
@RequestMapping("/api/form-templates")
@CrossOrigin(origins = "*")
public class FormTemplateController {

    @Autowired
    private FormTemplateService formTemplateService;

    /**
     * Lấy danh sách tất cả form templates đang hoạt động
     */
    @GetMapping
    public ResponseEntity<List<FormTemplateDto>> getAllActiveFormTemplates() {
        List<FormTemplateDto> formTemplates = formTemplateService.getAllActiveFormTemplates();
        return ResponseEntity.ok(formTemplates);
    }

    /**
     * Lấy chi tiết form template và các fields
     */
    @GetMapping("/{formTemplateId}")
    public ResponseEntity<FormTemplateDto> getFormTemplateById(@PathVariable Long formTemplateId) {
        Optional<FormTemplateDto> formTemplate = formTemplateService.getFormTemplateById(formTemplateId);
        return formTemplate.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Lấy danh sách fields của form template
     */
    @GetMapping("/{formTemplateId}/fields")
    public ResponseEntity<List<FormFieldDto>> getFormFields(@PathVariable Long formTemplateId) {
        List<FormFieldDto> fields = formTemplateService.getFormFields(formTemplateId);
        return ResponseEntity.ok(fields);
    }

    /**
     * Tạo form template mới (cho nhân viên tạo form động)
     */
    @PostMapping
    public ResponseEntity<FormTemplateDto> createFormTemplate(@Valid @RequestBody FormTemplateDto formTemplateDto) {
        FormTemplateDto createdTemplate = formTemplateService.createFormTemplate(formTemplateDto);
        return ResponseEntity.ok(createdTemplate);
    }

    /**
     * Thêm field vào form template
     */
    @PostMapping("/{formTemplateId}/fields")
    public ResponseEntity<FormFieldDto> addFieldToTemplate(
            @PathVariable Long formTemplateId,
            @Valid @RequestBody FormFieldDto formFieldDto) {
        
        FormFieldDto createdField = formTemplateService.addFieldToTemplate(formTemplateId, formFieldDto);
        return ResponseEntity.ok(createdField);
    }

    /**
     * Cập nhật field trong form template
     */
    @PutMapping("/{formTemplateId}/fields/{fieldId}")
    public ResponseEntity<FormFieldDto> updateFormField(
            @PathVariable Long formTemplateId,
            @PathVariable Long fieldId,
            @Valid @RequestBody FormFieldDto formFieldDto) {
        
        Optional<FormFieldDto> updatedField = formTemplateService.updateFormField(fieldId, formFieldDto);
        return updatedField.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Xóa field khỏi form template
     */
    @DeleteMapping("/{formTemplateId}/fields/{fieldId}")
    public ResponseEntity<Void> deleteFormField(
            @PathVariable Long formTemplateId,
            @PathVariable Long fieldId) {
        
        boolean deleted = formTemplateService.deleteFormField(fieldId);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    /**
     * Lấy danh sách field types có sẵn
     */
    @GetMapping("/field-types")
    public ResponseEntity<List<FieldTypeDto>> getFieldTypes() {
        List<FieldTypeDto> fieldTypes = formTemplateService.getAllFieldTypes();
        return ResponseEntity.ok(fieldTypes);
    }

    /**
     * DTO cho Field Types
     */
    public static class FieldTypeDto {
        private Long id;
        private String name;
        private String description;

        public FieldTypeDto() {}

        public FieldTypeDto(Long id, String name, String description) {
            this.id = id;
            this.name = name;
            this.description = description;
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
}