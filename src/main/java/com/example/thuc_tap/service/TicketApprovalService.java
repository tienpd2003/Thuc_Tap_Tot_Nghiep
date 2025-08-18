package com.example.thuc_tap.service;

import com.example.thuc_tap.dto.TicketApprovalDto;
import com.example.thuc_tap.entity.*;
import com.example.thuc_tap.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketApprovalService {
    
    private final TicketApprovalRepository ticketApprovalRepository;
    private final UserRepository userRepository;
    private final TicketStatusRepository ticketStatusRepository;
    
    /**
     * Tạo approval tasks từ approval workflows của template
     */
    public void createApprovalTasksFromTemplate(Ticket ticket) {
        if (ticket.getFormTemplate() == null || 
            ticket.getFormTemplate().getApprovalWorkflows() == null ||
            ticket.getFormTemplate().getApprovalWorkflows().isEmpty()) {
            return; // Không có approval workflow
        }
        
        // Kiểm tra đã tạo approval tasks chưa
        if (ticketApprovalRepository.existsByTicketId(ticket.getId())) {
            return; // Đã tạo rồi
        }
        
        // Lấy status PENDING
        TicketStatus pendingStatus = ticketStatusRepository.findByName("PENDING")
                .orElseThrow(() -> new RuntimeException("PENDING status not found"));
        
        // Tạo approval tasks từ workflows
        List<ApprovalWorkflow> workflows = ticket.getFormTemplate().getApprovalWorkflows();
        
        for (ApprovalWorkflow workflow : workflows) {
            TicketApproval approval = new TicketApproval();
            approval.setTicket(ticket);
            approval.setWorkflowStep(workflow);
            approval.setAction(ApprovalAction.PENDING); // Trạng thái ban đầu
            approval.setStatus(pendingStatus);
            
            // Không assign approver cụ thể - bất kỳ APPROVER nào trong department có thể approve
            // approval.setApprover(null); // Sẽ được assign khi có người approve
            
            ticketApprovalRepository.save(approval);
        }
    }
    
    /**
     * Lấy danh sách approval tasks của ticket
     */
    public List<TicketApprovalDto> getTicketApprovals(Long ticketId) {
        List<TicketApproval> approvals = ticketApprovalRepository.findByTicketIdOrderByStepOrder(ticketId);
        return approvals.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Lấy approval task đang pending đầu tiên
     */
    public TicketApprovalDto getNextPendingApproval(Long ticketId) {
        return ticketApprovalRepository.findFirstPendingByTicketId(ticketId)
                .map(this::convertToDto)
                .orElse(null);
    }
    
    /**
     * Lấy danh sách approvers có thể approve cho workflow step
     */
    public List<User> getAvailableApprovers(Long ticketApprovalId) {
        TicketApproval approval = ticketApprovalRepository.findById(ticketApprovalId)
                .orElseThrow(() -> new RuntimeException("Approval not found"));
        
        if (approval.getWorkflowStep().getDepartment() != null) {
            return userRepository.findByDepartmentIdAndRoleName(
                approval.getWorkflowStep().getDepartment().getId(), "APPROVER");
        }
        
        return List.of();
    }
    
    /**
     * Convert entity to DTO
     */
    private TicketApprovalDto convertToDto(TicketApproval approval) {
        TicketApprovalDto dto = new TicketApprovalDto();
        dto.setId(approval.getId());
        dto.setTicketId(approval.getTicket().getId());
        dto.setStepOrder(approval.getWorkflowStep().getStepOrder());
        dto.setStepName(approval.getWorkflowStep().getStepName());
        dto.setAction(approval.getAction().name());
        dto.setComments(approval.getComments());
        dto.setCreatedAt(approval.getCreatedAt());
        
        if (approval.getApprover() != null) {
            dto.setApproverId(approval.getApprover().getId());
            dto.setApproverName(approval.getApprover().getFullName());
        }
        
        if (approval.getWorkflowStep().getDepartment() != null) {
            dto.setDepartmentId(approval.getWorkflowStep().getDepartment().getId());
            dto.setDepartmentName(approval.getWorkflowStep().getDepartment().getName());
        }
        
        return dto;
    }
}
