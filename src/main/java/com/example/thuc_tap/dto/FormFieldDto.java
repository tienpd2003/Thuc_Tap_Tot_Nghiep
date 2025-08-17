package com.example.thuc_tap.dto;

import com.example.thuc_tap.common.FieldOption;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormFieldDto {

    @NotBlank(message = "Field name is required")
    @Size(max = 100, message = "Field name must not exceed 100 characters")
    private String fieldName;
    
    @NotBlank(message = "Field label is required")
    @Size(max = 100, message = "Field label must not exceed 100 characters")
    private String fieldLabel;
    
    @NotNull(message = "Field type ID is required")
    @Positive(message = "Field type ID must be positive")
    private Long fieldTypeId;
    
    private String fieldTypeName;
    private Boolean isRequired = false;
    
    @NotNull(message = "Field order is required")
    @Positive(message = "Field order must be positive")
    private Integer fieldOrder;
    
    private Boolean readOnly = false;
    private List<FieldOption> fieldOptions = new ArrayList<>();
    private Map<String, Object> validationRules = new HashMap<>();

}
