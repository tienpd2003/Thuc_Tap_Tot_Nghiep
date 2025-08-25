package com.example.thuc_tap.service;

import com.example.thuc_tap.entity.*;
import com.example.thuc_tap.repository.TicketHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketHistoryService {
    
    private final TicketHistoryRepository ticketHistoryRepository;
    
    /**
     * Tạo lịch sử khi ticket được tạo
     */
    public void createTicketCreatedHistory(Ticket ticket, User createdBy) {
        TicketHistory history = new TicketHistory();
        history.setTicket(ticket);
        history.setActionByUser(createdBy);
        history.setActionType(TicketHistory.TicketHistoryAction.CREATED);
        history.setActionDescription("Ticket được tạo");
        history.setToStatus(ticket.getCurrentStatus().getName());
        
        ticketHistoryRepository.save(history);
    }
    
    /**
     * Tạo lịch sử khi ticket được duyệt
     */
    public void createApprovedHistory(Ticket ticket, User approver, String comments, String fromStatus, String toStatus) {
        TicketHistory history = new TicketHistory();
        history.setTicket(ticket);
        history.setActionByUser(approver);
        history.setActionType(TicketHistory.TicketHistoryAction.APPROVED);
        history.setActionDescription("Ticket được duyệt bởi " + approver.getFullName());
        history.setFromStatus(fromStatus);
        history.setToStatus(toStatus);
        history.setComments(comments);
        
        ticketHistoryRepository.save(history);
    }
    
    /**
     * Tạo lịch sử khi ticket bị từ chối
     */
    public void createRejectedHistory(Ticket ticket, User rejector, String reason, String fromStatus, String toStatus) {
        TicketHistory history = new TicketHistory();
        history.setTicket(ticket);
        history.setActionByUser(rejector);
        history.setActionType(TicketHistory.TicketHistoryAction.REJECTED);
        history.setActionDescription("Ticket bị từ chối bởi " + rejector.getFullName());
        history.setFromStatus(fromStatus);
        history.setToStatus(toStatus);
        history.setComments(reason);
        
        ticketHistoryRepository.save(history);
    }
    
    /**
     * Tạo lịch sử khi trạng thái ticket thay đổi
     */
    public void createStatusChangedHistory(Ticket ticket, User changedBy, String fromStatus, String toStatus, String description) {
        TicketHistory history = new TicketHistory();
        history.setTicket(ticket);
        history.setActionByUser(changedBy);
        history.setActionType(TicketHistory.TicketHistoryAction.STATUS_CHANGED);
        history.setActionDescription(description);
        history.setFromStatus(fromStatus);
        history.setToStatus(toStatus);
        
        ticketHistoryRepository.save(history);
    }
    
    /**
     * Lấy lịch sử của ticket
     */
    public List<TicketHistory> getTicketHistory(Long ticketId) {
        return ticketHistoryRepository.findByTicketIdOrderByCreatedAtDesc(ticketId);
    }
}
