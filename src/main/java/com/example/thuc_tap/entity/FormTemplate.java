package com.example.thuc_tap.entity;

import com.example.thuc_tap.common.FormSchema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "form_templates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormTemplate {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    // SLA: số ngày tới hạn từ lúc tạo ticket (admin cấu hình trên template)
    @Column(name = "due_in_days")
    private Integer dueInDays;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
//    @OneToMany(mappedBy = "formTemplate", cascade = CascadeType.ALL)
//    private List<FormField> formFields;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "form_schema", columnDefinition = "jsonb")
    private FormSchema formSchema;
    
    @OneToMany(mappedBy = "formTemplate", cascade = CascadeType.ALL)
    private List<ApprovalWorkflow> approvalWorkflows;
    
    @OneToMany(mappedBy = "formTemplate", cascade = CascadeType.ALL)
    private List<Ticket> tickets;
}
