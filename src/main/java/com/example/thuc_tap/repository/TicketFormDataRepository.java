package com.example.thuc_tap.repository;

import com.example.thuc_tap.entity.TicketFormData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketFormDataRepository extends JpaRepository<TicketFormData, Long> {
    
    List<TicketFormData> findByTicketId(Long ticketId);
    
    void deleteByTicketId(Long ticketId);
    
    List<TicketFormData> findByFieldId(Long fieldId);
}
