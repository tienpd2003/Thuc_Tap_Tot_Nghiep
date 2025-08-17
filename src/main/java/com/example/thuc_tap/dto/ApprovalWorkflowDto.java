package com.example.thuc_tap.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalWorkflowDto {

    @NotNull(message = "Step order is required")
    @Positive(message = "Step order must be positive")
    private Integer stepOrder;
    
    // departmentId có thể null cho trường hợp "Trưởng phòng duyệt"
    private Long departmentId;
    
    @NotBlank(message = "Step name is required")
    @Size(max = 100, message = "Step name must not exceed 100 characters")
    private String stepName;

}
