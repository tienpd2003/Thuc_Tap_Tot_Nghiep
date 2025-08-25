package com.example.thuc_tap.repository;

import com.example.thuc_tap.entity.TicketApproval;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketApprovalRepository extends JpaRepository<TicketApproval, Long> {
    
    /**
     * Lấy tất cả approvals của một ticket theo thứ tự step
     */
    @Query("SELECT ta FROM TicketApproval ta " +
           "JOIN ta.workflowStep ws " +
           "WHERE ta.ticket.id = :ticketId " +
           "ORDER BY ws.stepOrder ASC")
    List<TicketApproval> findByTicketIdOrderByStepOrder(@Param("ticketId") Long ticketId);
    
    /**
     * Lấy approval task đang pending đầu tiên của ticket
     */
    @Query("SELECT ta FROM TicketApproval ta " +
           "JOIN ta.workflowStep ws " +
           "WHERE ta.ticket.id = :ticketId " +
           "AND ta.action = 'PENDING' " +
           "ORDER BY ws.stepOrder ASC")
    Optional<TicketApproval> findFirstPendingByTicketId(@Param("ticketId") Long ticketId);
    
    /**
     * Kiểm tra xem ticket đã có approval tasks chưa
     */
    boolean existsByTicketId(Long ticketId);
    
    /**
     * Lấy approvals theo approver
     */
    List<TicketApproval> findByApproverIdAndAction(Long approverId, String action);
    
    /**
     * Đếm số approval tasks pending của một approver
     */
    long countByApproverIdAndAction(Long approverId, String action);

    // === APPROVAL STATISTICS QUERIES - CORRECTED LOGIC ===

    // Chờ duyệt: action = PENDING và approver_id = người đang đăng nhập
    @Query("SELECT COUNT(ta) FROM TicketApproval ta WHERE ta.action = 'PENDING' AND ta.approver.id = :approverId")
    long countPendingForApprover(@Param("approverId") Long approverId);

    // Đã duyệt: action = APPROVE và approver_id = người đó
    @Query("SELECT COUNT(ta) FROM TicketApproval ta WHERE ta.action = 'APPROVE' AND ta.approver.id = :approverId")
    long countApprovedByApprover(@Param("approverId") Long approverId);

    // Từ chối: action = REJECT và approver_id = người đó
    @Query("SELECT COUNT(ta) FROM TicketApproval ta WHERE ta.action = 'REJECT' AND ta.approver.id = :approverId")
    long countRejectedByApprover(@Param("approverId") Long approverId);

    // Đã xử lý: gồm đã duyệt + từ chối
    @Query("SELECT COUNT(ta) FROM TicketApproval ta WHERE (ta.action = 'APPROVE' OR ta.action = 'REJECT') AND ta.approver.id = :approverId")
    long countProcessedByApprover(@Param("approverId") Long approverId);

    // Danh sách tickets chờ duyệt: action = PENDING và approver_id = người đang đăng nhập
    @Query("SELECT ta FROM TicketApproval ta " +
           "LEFT JOIN FETCH ta.ticket t " +
           "LEFT JOIN FETCH t.requester " +
           "LEFT JOIN FETCH t.department " +
           "LEFT JOIN FETCH t.formTemplate " +
           "LEFT JOIN FETCH t.priority " +
           "WHERE ta.action = 'PENDING' AND ta.approver.id = :approverId " +
           "AND (:departmentId IS NULL OR t.department.id = :departmentId) " +
           "AND (:formTemplateId IS NULL OR t.formTemplate.id = :formTemplateId) " +
           "AND (:priority IS NULL OR t.priority.name = :priority) " +
           "AND (:employeeCode IS NULL OR t.requester.employeeCode LIKE CONCAT('%', cast(:employeeCode as string), '%')) " +
           "AND (:q IS NULL OR LOWER(t.title) LIKE CONCAT('%', LOWER(cast(:q as string)), '%') " +
           "     OR LOWER(t.requester.fullName) LIKE CONCAT('%', LOWER(cast(:q as string)), '%'))")
    Page<TicketApproval> findPendingForApprover(
        @Param("approverId") Long approverId,
        @Param("departmentId") Long departmentId,
        @Param("formTemplateId") Long formTemplateId,
        @Param("priority") String priority,
        @Param("employeeCode") String employeeCode,
        @Param("q") String q,
        Pageable pageable
    );

    // Danh sách tickets đã xử lý: (action = APPROVE OR REJECT) và approver_id = người đó
    @Query("SELECT ta FROM TicketApproval ta " +
           "LEFT JOIN FETCH ta.ticket t " +
           "LEFT JOIN FETCH t.requester " +
           "LEFT JOIN FETCH t.department " +
           "LEFT JOIN FETCH t.formTemplate " +
           "LEFT JOIN FETCH t.priority " +
           "WHERE (ta.action = 'APPROVE' OR ta.action = 'REJECT') AND ta.approver.id = :approverId " +
           "AND (:departmentId IS NULL OR t.department.id = :departmentId) " +
           "AND (:formTemplateId IS NULL OR t.formTemplate.id = :formTemplateId) " +
           "AND (:priority IS NULL OR t.priority.name = :priority) " +
           "AND (:employeeCode IS NULL OR t.requester.employeeCode LIKE CONCAT('%', cast(:employeeCode as string), '%')) " +
           "AND (:q IS NULL OR LOWER(t.title) LIKE CONCAT('%', LOWER(cast(:q as string)), '%') " +
           "     OR LOWER(t.requester.fullName) LIKE CONCAT('%', LOWER(cast(:q as string)), '%'))")
    Page<TicketApproval> findProcessedByApprover(
        @Param("approverId") Long approverId,
        @Param("departmentId") Long departmentId,
        @Param("formTemplateId") Long formTemplateId,
        @Param("priority") String priority,
        @Param("employeeCode") String employeeCode,
        @Param("q") String q,
        Pageable pageable
    );
}
