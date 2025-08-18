package com.example.thuc_tap.repository;

import com.example.thuc_tap.entity.TicketApproval;
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
}
