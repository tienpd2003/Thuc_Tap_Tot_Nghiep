package com.example.thuc_tap.repository;

import com.example.thuc_tap.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    Optional<Ticket> findByTicketCode(String ticketCode);
    
    boolean existsByTicketCode(String ticketCode);
    
    List<Ticket> findByRequesterId(Long requesterId);
    
    List<Ticket> findByDepartmentId(Long departmentId);
    
    List<Ticket> findByCurrentStatusId(Long statusId);
    
    List<Ticket> findByPriorityId(Long priorityId);
    
    List<Ticket> findByFormTemplateId(Long formTemplateId);
    
    @Query("SELECT t FROM Ticket t WHERE t.requester.id = :userId")
    Page<Ticket> findByRequesterIdWithPagination(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT t FROM Ticket t WHERE t.department.id = :departmentId")
    Page<Ticket> findByDepartmentIdWithPagination(@Param("departmentId") Long departmentId, Pageable pageable);
    
    @Query("SELECT t FROM Ticket t WHERE t.currentStatus.name = :statusName")
    List<Ticket> findByStatusName(@Param("statusName") String statusName);
    
    @Query("SELECT t FROM Ticket t WHERE t.createdAt BETWEEN :startDate AND :endDate")
    List<Ticket> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Ticket t WHERE t.dueDate < :currentDate AND t.currentStatus.name != 'APPROVED' AND t.currentStatus.name != 'REJECTED'")
    List<Ticket> findOverdueTickets(@Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.department.id = :departmentId AND t.currentStatus.name = :statusName")
    Long countByDepartmentAndStatus(@Param("departmentId") Long departmentId, @Param("statusName") String statusName);
}
