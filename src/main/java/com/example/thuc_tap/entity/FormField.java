package com.example.thuc_tap.entity;

import com.example.thuc_tap.common.FieldOption;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "form_fields")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormField {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "form_template_id", nullable = false)
    private FormTemplate formTemplate;
    
    @Column(name = "field_name", nullable = false, length = 100)
    private String fieldName;
    
    @Column(name = "field_label", nullable = false, length = 100)
    private String fieldLabel;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_type_id", nullable = false)
    private FieldType fieldType;
    
    @Column(name = "is_required", nullable = false)
    private Boolean isRequired = false;
    
    @Column(name = "field_order", nullable = false)
    private Integer fieldOrder;

    @Column(name = "read_only", nullable = false)
    private Boolean readOnly = false;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "field_options", columnDefinition = "jsonb")
    private List<FieldOption> fieldOptions = new ArrayList<>(); // Cho select, radio, checkbox

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "validation_rules", columnDefinition = "jsonb")
    private Map<String, Object> validationRules = new HashMap<>(); // Quy tắc validation
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
