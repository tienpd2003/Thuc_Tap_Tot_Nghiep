package com.example.thuc_tap.controller;

import com.example.thuc_tap.dto.FormTemplateDto;
import com.example.thuc_tap.dto.request.CreateFormTemplateRequest;
import com.example.thuc_tap.service.FormTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/form-templates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FormTemplateController {

    private final FormTemplateService formTemplateService;

    @PostMapping
    public ResponseEntity<FormTemplateDto> createFormTemplate(@RequestBody CreateFormTemplateRequest request) {
        FormTemplateDto formTemplate = formTemplateService.createFormTemplate(request);
        return ResponseEntity.ok(formTemplate);
    }
}
