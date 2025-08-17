package com.example.thuc_tap.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormTemplateFilterResponse {

    private Long id;
    private String name;
    private String description;
    private Boolean isActive;
    private String createdByFullName;
    private String createdByUsername;
    private String createdAt;
    private String updatedAt;

    private List<String> approvalDepartments; // sắp xếp theo stepOrder

    public FormTemplateFilterResponse(Long id, String name, String description, Boolean isActive,
                                      String createdByFullName, String createdByUsername,
                                      LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isActive = isActive;
        this.createdByFullName = createdByFullName;
        this.createdByUsername = createdByUsername;
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        this.createdAt = createdAt != null ? createdAt.format(formatter) : null;
        this.updatedAt = updatedAt != null ? updatedAt.format(formatter) : null;
    }

}
