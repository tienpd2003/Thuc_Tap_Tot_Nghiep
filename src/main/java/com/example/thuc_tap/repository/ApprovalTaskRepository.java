package com.example.thuc_tap.repository;

import com.example.thuc_tap.entity.ApprovalTask;
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
    @Query("UPDATE ApprovalTask at SET at.status = :newStatus, at.actedAt = CURRENT_TIMESTAMP WHERE at.id = :taskId AND at.status = 'PENDING'")
    int updateStatusIfPending(@Param("taskId") Long taskId, @Param("newStatus") String newStatus);

    @Query("SELECT at FROM ApprovalTask at JOIN at.ticket t " +
            "WHERE at.status = 'PENDING' " +
            "AND (:departmentId IS NULL OR t.department.id = :departmentId) " +
            "AND (:type IS NULL OR t.formTemplate.id = :type) " +
            "AND (:priority IS NULL OR t.priority.id = :priority) " +
            "AND (:q IS NULL OR (LOWER(t.ticketCode) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(t.title) LIKE LOWER(CONCAT('%',:q,'%'))))")
    Page<ApprovalTask> findPendingFiltered(@Param("departmentId") Long departmentId,
                                           @Param("type") Long type,
                                           @Param("priority") Long priority,
                                           @Param("q") String q,
                                           Pageable pageable);
}
