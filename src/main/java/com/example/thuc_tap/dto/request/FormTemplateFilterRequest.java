package com.example.thuc_tap.dto.request;

import lombok.Data;
import org.springframework.data.domain.Sort;

@Data
public class FormTemplateFilterRequest {

    // Search
    private String keyword; // tìm kiếm theo tên form, mô tả form

    // Filter
    private Boolean isActive;
    private String createdById;

    private Long approvalDepartmentId;

    private String createdAtFrom;
    private String createdAtTo;

    private String updatedAtFrom;
    private String updatedAtTo;

    // Pagination
    private Integer page = 0;
    private Integer pageSize = 10;

    // Sorting
    private String sortBy = "createdAt";
    private String sortDirection = "desc";
}
