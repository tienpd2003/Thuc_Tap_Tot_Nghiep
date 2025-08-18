package com.example.thuc_tap.repository;

import com.example.thuc_tap.entity.TicketApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketApprovalRepository extends JpaRepository<TicketApproval, Long> {
    List<TicketApproval> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
}
