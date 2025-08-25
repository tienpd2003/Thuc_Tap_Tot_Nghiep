package com.example.thuc_tap.repository;

import com.example.thuc_tap.entity.ApprovalTask;
import com.example.thuc_tap.entity.ApprovalTaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprovalTaskRepository extends JpaRepository<ApprovalTask, Long> {

    List<ApprovalTask> findByTicketIdOrderByStepIndex(Long ticketId);

    @Modifying
    @Query("UPDATE ApprovalTask at SET at.status = :newStatus, at.actedAt = CURRENT_TIMESTAMP " +
            "WHERE at.id = :taskId AND at.status = com.example.thuc_tap.entity.ApprovalTaskStatus.PENDING")
    int updateStatusIfPending(@Param("taskId") Long taskId, @Param("newStatus") ApprovalTaskStatus newStatus);

    @Query("SELECT at FROM ApprovalTask at JOIN at.ticket t " +
            "WHERE at.status = com.example.thuc_tap.entity.ApprovalTaskStatus.PENDING " +
            "AND (:departmentId IS NULL OR t.department.id = :departmentId) " +
            "AND (:type IS NULL OR t.formTemplate.id = :type) " +
            "AND (:priority IS NULL OR t.priority.id = :priority) " +
            "AND (:q IS NULL OR (LOWER(t.ticketCode) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(t.title) LIKE LOWER(CONCAT('%',:q,'%'))))")
    Page<ApprovalTask> findPendingFiltered(@Param("departmentId") Long departmentId,
                                           @Param("type") Long type,
                                           @Param("priority") Long priority,
                                           @Param("q") String q,
                                           Pageable pageable);

    // Statistics queries for approver - count tickets that this approver can handle
    @Query("SELECT COUNT(DISTINCT at.ticket.id) FROM ApprovalTask at " +
            "WHERE at.status = com.example.thuc_tap.entity.ApprovalTaskStatus.PENDING " +
            "AND (at.approver.id = :approverId OR " +
            "(at.approver IS NULL AND at.ticket.department IN " +
            "(SELECT u.department FROM User u WHERE u.id = :approverId)))")
    Long countPendingForApprover(@Param("approverId") Long approverId);

    @Query("SELECT COUNT(at) FROM ApprovalTask at " +
            "WHERE at.status IN (com.example.thuc_tap.entity.ApprovalTaskStatus.APPROVED, " +
            "com.example.thuc_tap.entity.ApprovalTaskStatus.REJECTED) " +
            "AND at.approver.id = :approverId")
    Long countProcessedByApprover(@Param("approverId") Long approverId);

    @Query("SELECT COUNT(at) FROM ApprovalTask at " +
            "WHERE at.status = com.example.thuc_tap.entity.ApprovalTaskStatus.APPROVED " +
            "AND at.approver.id = :approverId")
    Long countApprovedByApprover(@Param("approverId") Long approverId);

    @Query("SELECT COUNT(at) FROM ApprovalTask at " +
            "WHERE at.status = com.example.thuc_tap.entity.ApprovalTaskStatus.REJECTED " +
            "AND at.approver.id = :approverId")
    Long countRejectedByApprover(@Param("approverId") Long approverId);

    // Pending tickets for specific approver with filters
    @Query("SELECT DISTINCT at FROM ApprovalTask at " +
            "LEFT JOIN FETCH at.ticket t " +
            "LEFT JOIN FETCH t.requester " +
            "LEFT JOIN FETCH t.department " +
            "LEFT JOIN FETCH t.priority " +
            "LEFT JOIN FETCH t.formTemplate " +
            "WHERE at.status = com.example.thuc_tap.entity.ApprovalTaskStatus.PENDING " +
            "AND (at.approver.id = :approverId OR " +
            "(at.approver IS NULL AND t.department IN " +
            "(SELECT u.department FROM User u WHERE u.id = :approverId)))")
    Page<ApprovalTask> findPendingForApprover(@Param("approverId") Long approverId,
                                            @Param("departmentId") Long departmentId,
                                            @Param("formTemplateId") Long formTemplateId,
                                            @Param("priority") String priority,
                                            @Param("employeeCode") String employeeCode,
                                            @Param("q") String q,
                                            Pageable pageable);

    // Processed tickets by specific approver with filters - simplified
    @Query("SELECT at FROM ApprovalTask at LEFT JOIN FETCH at.ticket t LEFT JOIN FETCH t.requester LEFT JOIN FETCH t.department LEFT JOIN FETCH t.priority LEFT JOIN FETCH t.formTemplate " +
            "WHERE at.status IN (com.example.thuc_tap.entity.ApprovalTaskStatus.APPROVED, " +
            "com.example.thuc_tap.entity.ApprovalTaskStatus.REJECTED) " +
            "AND at.approver.id = :approverId")
    Page<ApprovalTask> findProcessedByApprover(@Param("approverId") Long approverId,
                                             @Param("departmentId") Long departmentId,
                                             @Param("formTemplateId") Long formTemplateId,
                                             @Param("priority") String priority,
                                             @Param("employeeCode") String employeeCode,
                                             @Param("q") String q,
                                             Pageable pageable);
}
