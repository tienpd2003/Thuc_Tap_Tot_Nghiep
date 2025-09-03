package com.example.thuc_tap.repository;

import com.example.thuc_tap.dto.response.FormTemplateFilterResponse;
import com.example.thuc_tap.entity.FormTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FormTemplateRepository extends JpaRepository<FormTemplate, Long> {
    
    List<FormTemplate> findByIsActive(Boolean isActive);
    
    List<FormTemplate> findByCreatedById(Long createdById);
    
    boolean existsByName(String name);

    @Query("""
        SELECT DISTINCT new com.example.thuc_tap.dto.response.FormTemplateFilterResponse(
            ft.id,
            ft.name,
            ft.description,
            ft.isActive,
            ft.dueInDays,
            ft.createdBy.fullName,
            ft.createdBy.username,
            ft.createdAt,
            ft.updatedAt)
        FROM FormTemplate ft
        LEFT JOIN User u ON u.id = ft.createdBy.id
        LEFT JOIN ApprovalWorkflow awf ON awf.formTemplate.id = ft.id
        LEFT JOIN Department d ON d.id = awf.department.id
        WHERE (:keyword IS NULL OR :keyword = '' OR ft.name LIKE %:keyword% OR ft.description LIKE %:keyword%)
        AND (:isActive IS NULL OR ft.isActive = :isActive)
        AND (:createdById IS NULL OR ft.createdBy.id = :createdById)
        AND (:createdAtFrom IS NULL OR ft.createdAt >= CAST(CAST(:createdAtFrom AS text) AS timestamp))
        AND (:createdAtTo IS NULL OR ft.createdAt <= CAST(CAST(:createdAtTo AS text) AS timestamp))
        AND (:updatedAtFrom IS NULL OR ft.updatedAt >= CAST(CAST(:updatedAtFrom AS text) AS timestamp))
        AND (:updatedAtTo IS NULL OR ft.updatedAt <= CAST(CAST(:updatedAtTo AS text) AS timestamp))
        AND (:approvalDepartmentId IS NULL OR ft.id IN (
            SELECT DISTINCT awf.formTemplate.id
            FROM ApprovalWorkflow awf
            WHERE awf.department.id = :approvalDepartmentId
        ))
    """)
    Page<FormTemplateFilterResponse> findByCriteria(@Param("keyword") String keyword,
                                                    @Param("isActive") Boolean isActive,
                                                    @Param("createdById") String createdById,
                                                    @Param("approvalDepartmentId") Long approvalDepartmentId,
                                                    @Param("createdAtFrom") LocalDateTime createdAtFrom,
                                                    @Param("createdAtTo") LocalDateTime createdAtTo,
                                                    @Param("updatedAtFrom") LocalDateTime updatedAtFrom,
                                                    @Param("updatedAtTo") LocalDateTime updatedAtTo,
                                                    Pageable pageable);

    @Query("""
        SELECT awf.department.name
        FROM ApprovalWorkflow awf
        WHERE awf.formTemplate.id = :formTemplateId
        ORDER BY awf.stepOrder
    """)
    List<String> findApprovalDepartmentsByFormTemplateId(@Param("formTemplateId") Long formTemplateId);
}
