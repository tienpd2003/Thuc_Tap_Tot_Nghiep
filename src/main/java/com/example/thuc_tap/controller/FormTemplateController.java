package com.example.thuc_tap.controller;

//import com.example.thuc_tap.dto.FormTemplateDto;
import com.example.thuc_tap.dto.request.CreateFormTemplateRequest;
import com.example.thuc_tap.dto.request.FormTemplateFilterRequest;
import com.example.thuc_tap.dto.response.FormTemplateFilterResponse;
import com.example.thuc_tap.dto.response.FormTemplateResponse;
import com.example.thuc_tap.service.FormTemplateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
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
    @Operation(
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(
                mediaType = "application/json",
                examples = {
                    @ExampleObject(
                        name = "Leave Request Template",
                        summary = "Leave Request Form Template",
                        description = "A complete example of a leave request form template",
                        value = """
                            {
                              "name": "Leave Request",
                              "description": "Mẫu đơn xin nghỉ phép dành cho nhân viên công ty",
                              "isActive": true,
                              "createdById": 3,
                              "formFields": [
                                {
                                  "fieldName": "fullName",
                                  "fieldLabel": "Họ và tên",
                                  "fieldTypeId": 1,
                                  "isRequired": true,
                                  "fieldOrder": 1,
                                  "readOnly": true
                                },
                                {
                                  "fieldName": "employeeCode",
                                  "fieldLabel": "Mã nhân viên",
                                  "fieldTypeId": 1,
                                  "isRequired": true,
                                  "fieldOrder": 2,
                                  "readOnly": true
                                },
                                {
                                  "fieldName": "department",
                                  "fieldLabel": "Phòng ban",
                                  "fieldTypeId": 1,
                                  "isRequired": true,
                                  "fieldOrder": 3,
                                  "readOnly": true
                                },
                                {
                                  "fieldName": "leaveType",
                                  "fieldLabel": "Loại nghỉ",
                                  "fieldTypeId": 6,
                                  "isRequired": true,
                                  "fieldOrder": 4,
                                  "fieldOptions": [
                                    { "value": "annual", "label": "Nghỉ phép năm" },
                                    { "value": "sick", "label": "Nghỉ ốm" },
                                    { "value": "personal", "label": "Nghỉ việc riêng" },
                                    { "value": "unpaid", "label": "Nghỉ không lương" }
                                  ]
                                },
                                {
                                  "fieldName": "startDate",
                                  "fieldLabel": "Ngày bắt đầu",
                                  "fieldTypeId": 3,
                                  "isRequired": true,
                                  "fieldOrder": 5
                                },
                                {
                                  "fieldName": "endDate",
                                  "fieldLabel": "Ngày kết thúc",
                                  "fieldTypeId": 3,
                                  "isRequired": true,
                                  "fieldOrder": 6
                                },
                                {
                                  "fieldName": "reason",
                                  "fieldLabel": "Lý do",
                                  "fieldTypeId": 7,
                                  "isRequired": true,
                                  "fieldOrder": 7,
                                  "validationRules": {
                                    "min": 10,
                                    "max": 500
                                  }
                                },
                                {
                                  "fieldName": "note",
                                  "fieldLabel": "Ghi chú",
                                  "fieldTypeId": 7,
                                  "fieldOrder": 8,
                                  "validationRules": {
                                    "min": 10,
                                    "max": 500
                                  }
                                }
                              ],
                              "approvalWorkflows": [
                                {
                                  "stepOrder": 1,
                                  "departmentId": null,
                                  "stepName": "Trưởng phòng duyệt"
                                },
                                {
                                  "stepOrder": 2,
                                  "departmentId": 1,
                                  "stepName": "Phòng nhân sự duyệt"
                                },
                                {
                                  "stepOrder": 3,
                                  "departmentId": 2,
                                  "stepName": "Phòng kế toán duyệt"
                                }
                              ]
                            }
                            """
                    )
                }
            )
        )
    )
    public ResponseEntity<FormTemplateResponse> createFormTemplate(@RequestBody CreateFormTemplateRequest request) {
        FormTemplateResponse formTemplate = formTemplateService.createFormTemplate(request);
        return ResponseEntity.ok(formTemplate);
    }
}
