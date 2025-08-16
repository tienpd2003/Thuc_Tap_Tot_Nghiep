package com.example.thuc_tap.controller;

//import com.example.thuc_tap.dto.FormTemplateDto;
import com.example.thuc_tap.dto.request.CreateFormTemplateRequest;
import com.example.thuc_tap.dto.request.FormTemplateFilterRequest;
import com.example.thuc_tap.dto.response.FormTemplateFilterResponse;
import com.example.thuc_tap.dto.response.FormTemplateResponse;
import com.example.thuc_tap.service.FormTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/form-templates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FormTemplateController {

    private final FormTemplateService formTemplateService;

    @GetMapping
    public ResponseEntity<Page<FormTemplateFilterResponse>> getAllFormTemplates(@Valid @ParameterObject @ModelAttribute FormTemplateFilterRequest filterRequest) {
        return ResponseEntity.ok(formTemplateService.getAllFormTemplates(filterRequest));
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<FormTemplateResponse> getFormTemplate(@PathVariable Long id) {
        return ResponseEntity.ok(formTemplateService.getFormTemplateById(id));
    }

    @PostMapping
    public ResponseEntity<FormTemplateResponse> createFormTemplate(@RequestBody CreateFormTemplateRequest request) {
        FormTemplateResponse formTemplate = formTemplateService.createFormTemplate(request);
        return ResponseEntity.ok(formTemplate);
    }
}
