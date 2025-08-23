package com.example.thuc_tap.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FormSchema {

    private Integer version;
    private List<FieldSchema> fields;
    private Map<String, Object> layout;
    private Map<String, Object> permissions;

    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class FieldSchema {
        private Long id; // optional DB ref
        private String key; // required
        private Object label; // string or i18n map
        private String type; // text, number, dropdown, repeater...
        private String placeholder;
        private String helpText;
        private Integer order;
        private Boolean readOnly;
        private Object defaultValue;
        private List<Option> options;
        private UIConfig ui;
        private ValidationConfig validation;
        private Visibility visibility;
        private RepeatConfig repeatConfig;
        private List<FieldSchema> subFields; // for table/repeater
        private Map<String, Object> meta;
    }

    @Data
    public static class Option {
        private String value;
        private String label;
        private Boolean disabled;
        private Map<String,Object> meta;
    }

    @Data
    public static class UIConfig {
        private Integer colSpan;
        private String component;
        private Integer rows;
        private Map<String,Object> asyncOptions;
        private Map<String,Object> file;
    }

    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ValidationConfig {
        private Boolean required;
        private Integer minLength;
        private Integer maxLength;
        private String pattern;
        private Double min;
        private Double max;
        private String minDate;
        private String maxDate;
        private Integer precision;
        private Boolean unique;
        private ConditionalRequired conditionalRequired;
        private FileValidation file;
        private String errorMessage;
    }

    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ConditionalRequired {
        private String dependsOn; // key của field mà điều kiện phụ thuộc vào
        private String operator; // "eq", "neq", "gt", "gte", "lt", "lte", "in", "not_in", "contains", "regex"
        private Object value;
    }

    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class FileValidation {
        private Integer maxSizeKB;
        private List<String> allowedMimeTypes;
        private Integer maxFiles;
    }

    @Data
    public static class Visibility {
        private List<Condition> conditions;
        private String logic; // AND|OR
    }

    @Data
    public static class Condition {
        private String fieldKey;
        private String operator; // eq, neq, gt...
        private Object value;
    }

    @Data
    public static class RepeatConfig {
        private Integer minRows;
        private Integer maxRows;
    }
}

