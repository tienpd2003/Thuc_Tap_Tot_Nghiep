package com.example.thuc_tap.service;

import com.example.thuc_tap.dto.TicketDto;
import com.example.thuc_tap.dto.TicketFormDataDto;
import com.example.thuc_tap.dto.request.CreateTicketFromTemplateRequest;
import com.example.thuc_tap.entity.*;
import com.example.thuc_tap.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service xử lý nghiệp vụ ticket cho nhân viên
 */
@Service
@Transactional
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private FormTemplateRepository formTemplateRepository;

    @Autowired
    private TicketStatusRepository ticketStatusRepository;

    @Autowired
    private PriorityLevelRepository priorityLevelRepository;
    
    // Removed unused TicketFormDataService since form data is stored as JSON in ticket
    
    @Autowired
    private ApprovalService approvalService;

    @Autowired
    private TicketApprovalService ticketApprovalService;

    /**
     * Lấy danh sách ticket của nhân viên với phân trang
     */
    public Page<TicketDto> getEmployeeTickets(Long employeeId, Pageable pageable) {
        Page<Ticket> tickets = ticketRepository.findByRequesterIdWithPagination(employeeId, pageable);
        return tickets.map(this::convertToDto);
    }

    /**
     * Lấy danh sách ticket của nhân viên theo trạng thái
     */
    public List<TicketDto> getEmployeeTicketsByStatus(Long employeeId, String statusName) {
        List<Ticket> tickets = ticketRepository.findByRequesterIdAndStatusName(employeeId, statusName);
        return tickets.stream().map(this::convertToDto).toList();
    }

    /**
     * Tìm kiếm ticket theo từ khóa
     */
    public List<TicketDto> searchEmployeeTickets(Long employeeId, String keyword) {
        List<Ticket> tickets = ticketRepository.findByRequesterIdAndTitleContainingIgnoreCase(employeeId, keyword);
        return tickets.stream().map(this::convertToDto).toList();
    }

    /**
     * Lấy ticket theo khoảng thời gian
     */
    public List<TicketDto> getEmployeeTicketsByDateRange(Long employeeId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Ticket> tickets = ticketRepository.findByRequesterIdAndCreatedAtBetween(employeeId, startDate, endDate);
        return tickets.stream().map(this::convertToDto).toList();
    }

    /**
     * Tạo ticket mới
     */
    public TicketDto createTicket(TicketDto ticketDto) {
        // Validate requester
        User requester = userRepository.findById(ticketDto.getRequesterId())
                .orElseThrow(() -> new RuntimeException("Requester not found"));

        // Validate department
        Department department = departmentRepository.findById(ticketDto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        // Get default status (PENDING)
        TicketStatus pendingStatus = ticketStatusRepository.findByName("PENDING")
                .orElseThrow(() -> new RuntimeException("PENDING status not found"));

        // Get default priority if not specified
        PriorityLevel priority = null;
        if (ticketDto.getPriorityId() != null) {
            priority = priorityLevelRepository.findById(ticketDto.getPriorityId())
                    .orElseThrow(() -> new RuntimeException("Priority not found"));
        } else {
            priority = priorityLevelRepository.findByName("MEDIUM")
                    .orElseThrow(() -> new RuntimeException("MEDIUM priority not found"));
        }

        // Create ticket
        Ticket ticket = new Ticket();
        ticket.setTicketCode(generateTicketCode());
        ticket.setTitle(ticketDto.getTitle());
        ticket.setDescription(ticketDto.getDescription());
        ticket.setRequester(requester);
        ticket.setDepartment(department);
        ticket.setCurrentStatus(pendingStatus);
        ticket.setPriority(priority);
        ticket.setDueDate(ticketDto.getDueDate());

        // Set form template if specified
        if (ticketDto.getFormTemplateId() != null) {
            FormTemplate formTemplate = formTemplateRepository.findById(ticketDto.getFormTemplateId())
                    .orElseThrow(() -> new RuntimeException("Form template not found"));
            ticket.setFormTemplate(formTemplate);
        }

        Ticket savedTicket = ticketRepository.save(ticket);
        
        // Tạo approval tasks từ template workflows
        // TODO: Implement createApprovalTasksFromTemplate method
        // approvalService.createApprovalTasksFromTemplate(savedTicket);
        
        return convertToDto(savedTicket);
    }

    /**
     * Tạo ticket từ form template với form data và workflow approvers
     */
    public TicketDto createTicketFromTemplate(CreateTicketFromTemplateRequest request) {
        System.out.println("Creating ticket from template. Request: " + request);
        
        // Validate form template
        FormTemplate formTemplate = formTemplateRepository.findById(request.getTemplateId())
                .orElseThrow(() -> new RuntimeException("Form template not found with ID: " + request.getTemplateId()));

        // Validate requester
        User requester = userRepository.findById(request.getRequesterId())
                .orElseThrow(() -> new RuntimeException("Requester not found with ID: " + request.getRequesterId()));

        // Get default status (PENDING)
        TicketStatus pendingStatus = ticketStatusRepository.findByName("PENDING")
                .orElseThrow(() -> new RuntimeException("PENDING status not found"));

        // Resolve priority: user-selected or default MEDIUM
        PriorityLevel priority;
        if (request.getPriorityId() != null) {
            priority = priorityLevelRepository.findById(request.getPriorityId())
                    .orElseThrow(() -> new RuntimeException("Priority not found with ID: " + request.getPriorityId()));
        } else {
            priority = priorityLevelRepository.findByName("MEDIUM")
                    .orElseThrow(() -> new RuntimeException("MEDIUM priority not found"));
        }

        // Create ticket
        Ticket ticket = new Ticket();
        ticket.setTicketCode(generateTicketCode());
        ticket.setTitle(request.getTitle() != null ? request.getTitle() : formTemplate.getName());
        ticket.setDescription(request.getDescription() != null ? request.getDescription() : formTemplate.getDescription());
        ticket.setRequester(requester);
        ticket.setDepartment(requester.getDepartment()); // Use requester's department
        ticket.setCurrentStatus(pendingStatus);
        ticket.setPriority(priority);
        ticket.setFormTemplate(formTemplate);
        // Auto compute due date if template has SLA days
        if (formTemplate.getDueInDays() != null && formTemplate.getDueInDays() > 0) {
            ticket.setDueDate(LocalDateTime.now().plusDays(formTemplate.getDueInDays()));
        }

        Ticket savedTicket = ticketRepository.save(ticket);

        // Save form data directly to ticket JSON field
        if (request.getFormData() != null && !request.getFormData().isEmpty()) {
            savedTicket.setFormData(request.getFormData());
            ticketRepository.save(savedTicket); // Update với form data
        }

        // Create approval tasks (accepts keys as workflowStepId or stepOrder)
        Map<String, String> workflowApprovers = request.getWorkflowApprovers();
        System.out.println("Raw workflowApprovers: " + workflowApprovers);
        if (workflowApprovers != null && !workflowApprovers.isEmpty()) {
            approvalService.createApprovalTasksWithFlexibleApprovers(savedTicket, workflowApprovers);
        } else {
            approvalService.createApprovalTasksFromTemplate(savedTicket);
        }

        return convertToDto(savedTicket);
    }

    // Form data is now saved directly in the ticket's JSON field
    // No need for separate TicketFormData entities for JSON-based forms

    /**
     * Lấy chi tiết ticket
     */
    public Optional<TicketDto> getTicketById(Long ticketId) {
        return ticketRepository.findById(ticketId).map(this::convertToDto);
    }

    /**
     * Cập nhật ticket (chỉ cho phép nhân viên cập nhật ticket của mình và chưa được duyệt)
     */
    public Optional<TicketDto> updateTicket(Long ticketId, Long employeeId, TicketDto ticketDto) {
        return ticketRepository.findById(ticketId)
                .filter(ticket -> ticket.getRequester().getId().equals(employeeId))
                .filter(ticket -> "PENDING".equals(ticket.getCurrentStatus().getName()))
                .map(ticket -> {
                    ticket.setTitle(ticketDto.getTitle());
                    ticket.setDescription(ticketDto.getDescription());
                    ticket.setDueDate(ticketDto.getDueDate());

                    // Update department if changed
                    if (ticketDto.getDepartmentId() != null) {
                        Department department = departmentRepository.findById(ticketDto.getDepartmentId())
                                .orElseThrow(() -> new RuntimeException("Department not found"));
                        ticket.setDepartment(department);
                    }

                    // Update priority if changed
                    if (ticketDto.getPriorityId() != null) {
                        PriorityLevel priority = priorityLevelRepository.findById(ticketDto.getPriorityId())
                                .orElseThrow(() -> new RuntimeException("Priority not found"));
                        ticket.setPriority(priority);
                    }

                    Ticket savedTicket = ticketRepository.save(ticket);
                    return convertToDto(savedTicket);
                });
    }

    /**
     * Xóa ticket (chỉ cho phép xóa ticket PENDING)
     */
    public boolean deleteTicket(Long ticketId, Long employeeId) {
        return ticketRepository.findById(ticketId)
                .filter(ticket -> ticket.getRequester().getId().equals(employeeId))
                .filter(ticket -> "PENDING".equals(ticket.getCurrentStatus().getName()))
                .map(ticket -> {
                    ticketRepository.delete(ticket);
                    return true;
                })
                .orElse(false);
    }

    /**
     * Thống kê ticket của nhân viên
     */
    public EmployeeTicketStats getEmployeeTicketStats(Long employeeId) {
        Long totalTickets = ticketRepository.countByRequesterId(employeeId);
        Long pendingTickets = ticketRepository.countByRequesterIdAndStatusName(employeeId, "PENDING");
        Long approvedTickets = ticketRepository.countByRequesterIdAndStatusName(employeeId, "APPROVED");
        Long rejectedTickets = ticketRepository.countByRequesterIdAndStatusName(employeeId, "REJECTED");
        Long inProgressTickets = ticketRepository.countByRequesterIdAndStatusName(employeeId, "IN_PROGRESS");

        return new EmployeeTicketStats(totalTickets, pendingTickets, approvedTickets, rejectedTickets, inProgressTickets);
    }

    /**
     * Generate ticket code
     */
    private String generateTicketCode() {
        String year = String.valueOf(LocalDateTime.now().getYear());
        Long count = ticketRepository.count() + 1;
        return String.format("TICKET-%s-%05d", year, count);
    }

    /**
     * Convert Entity to DTO
     */
    private TicketDto convertToDto(Ticket ticket) {
        TicketDto dto = new TicketDto();
        dto.setId(ticket.getId());
        dto.setTicketCode(ticket.getTicketCode());
        dto.setTitle(ticket.getTitle());
        dto.setDescription(ticket.getDescription());
        dto.setRequesterId(ticket.getRequester().getId());
        dto.setRequesterName(ticket.getRequester().getFullName());
        dto.setDepartmentId(ticket.getDepartment().getId());
        dto.setDepartmentName(ticket.getDepartment().getName());
        dto.setCurrentStatusId(ticket.getCurrentStatus().getId());
        dto.setCurrentStatusName(ticket.getCurrentStatus().getName());
        dto.setDueDate(ticket.getDueDate());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());

        if (ticket.getFormTemplate() != null) {
            dto.setFormTemplateId(ticket.getFormTemplate().getId());
            dto.setFormTemplateName(ticket.getFormTemplate().getName());
        }

        if (ticket.getPriority() != null) {
            dto.setPriorityId(ticket.getPriority().getId());
            dto.setPriorityName(ticket.getPriority().getName());
        }
        
        // Convert JSON form data to DTO format with label/type from schema
        if (ticket.getFormData() != null && !ticket.getFormData().isEmpty()) {
            List<TicketFormDataDto> formDataList = new ArrayList<>();
            ticket.getFormData().forEach((key, value) -> {
                TicketFormDataDto formDataDto = new TicketFormDataDto();
                formDataDto.setTicketId(ticket.getId());
                formDataDto.setFieldName(key);
                formDataDto.setFieldValue(value != null ? value.toString() : null);

                if (ticket.getFormTemplate() != null && ticket.getFormTemplate().getFormSchema() != null
                        && ticket.getFormTemplate().getFormSchema().getFields() != null) {
                    ticket.getFormTemplate().getFormSchema().getFields().stream()
                            .filter(field -> key.equals(field.getKey()))
                            .findFirst()
                            .ifPresent(schemaField -> {
                                formDataDto.setFieldLabel(schemaField.getLabel() != null ? schemaField.getLabel().toString() : null);
                                formDataDto.setFieldType(schemaField.getType());
                            });
                }

                formDataList.add(formDataDto);
            });
            dto.setFormData(formDataList);
        }
        
        // Load approvals if ticket already persisted
        if (ticket.getId() != null) {
            try {
                dto.setApprovals(ticketApprovalService.getTicketApprovals(ticket.getId()));
            } catch (Exception ignored) {
                // In case approval service is not available, keep approvals as null
            }
        }

        return dto;
    }

    /**
     * Inner class for employee ticket statistics
     */
    public static class EmployeeTicketStats {
        private Long totalTickets;
        private Long pendingTickets;
        private Long approvedTickets;
        private Long rejectedTickets;
        private Long inProgressTickets;

        public EmployeeTicketStats(Long totalTickets, Long pendingTickets, Long approvedTickets, 
                                 Long rejectedTickets, Long inProgressTickets) {
            this.totalTickets = totalTickets;
            this.pendingTickets = pendingTickets;
            this.approvedTickets = approvedTickets;
            this.rejectedTickets = rejectedTickets;
            this.inProgressTickets = inProgressTickets;
        }

        // Getters
        public Long getTotalTickets() { return totalTickets; }
        public Long getPendingTickets() { return pendingTickets; }
        public Long getApprovedTickets() { return approvedTickets; }
        public Long getRejectedTickets() { return rejectedTickets; }
        public Long getInProgressTickets() { return inProgressTickets; }
    }
}
