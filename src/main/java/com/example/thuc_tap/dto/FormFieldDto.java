package com.example.thuc_tap.dto;

import com.example.thuc_tap.common.FieldOption;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormFieldDto {

    private String fieldName;
    private String fieldLabel;
    private Long fieldTypeId;
    private String fieldTypeName;
    private Boolean isRequired;
    private Integer fieldOrder;
    private List<FieldOption> fieldOptions;
    private Map<String, Object> validationRules;

}
