package com.example.thuc_tap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalWorkflowDto {

    private Integer stepOrder;
    private Long departmentId;
    private String stepName;

}
