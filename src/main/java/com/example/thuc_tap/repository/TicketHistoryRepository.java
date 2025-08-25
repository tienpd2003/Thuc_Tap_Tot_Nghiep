package com.example.thuc_tap.repository;

import com.example.thuc_tap.entity.TicketHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketHistoryRepository extends JpaRepository<TicketHistory, Long> {
    
    /**
     * Lấy lịch sử của ticket theo thứ tự thời gian
     */
    @Query("SELECT th FROM TicketHistory th WHERE th.ticket.id = :ticketId ORDER BY th.createdAt ASC")
    List<TicketHistory> findByTicketIdOrderByCreatedAtAsc(@Param("ticketId") Long ticketId);
    
    /**
     * Lấy lịch sử của ticket theo thứ tự thời gian giảm dần
     */
    @Query("SELECT th FROM TicketHistory th WHERE th.ticket.id = :ticketId ORDER BY th.createdAt DESC")
    List<TicketHistory> findByTicketIdOrderByCreatedAtDesc(@Param("ticketId") Long ticketId);
}
