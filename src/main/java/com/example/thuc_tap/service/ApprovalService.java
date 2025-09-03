package com.example.thuc_tap.service;

import com.example.thuc_tap.dto.response.ApprovalStatsDto;
import com.example.thuc_tap.entity.*;
import com.example.thuc_tap.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ApprovalService {

    @Autowired
    private ApprovalTaskRepository approvalTaskRepository;

    @Autowired
    private TicketApprovalRepository ticketApprovalRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private TicketStatusRepository ticketStatusRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApprovalWorkflowRepository approvalWorkflowRepository; // optional
    
    @Autowired
    private TicketHistoryService ticketHistoryService;

    // --------------- Approve ----------------
    @Transactional
    public void approve(Long taskId, String note, Long actingUserId) {
        ApprovalTask task = approvalTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Approval task not found"));

        // Optional: authorization check: ensure actingUserId == task.getApprover().getId()
        if (task.getApprover() == null || !task.getApprover().getId().equals(actingUserId)) {
            // You may allow role-based approvers; adapt accordingly
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to approve this task");
        }

        // Atomic claim (returns 1 if succeeded, 0 if already acted)
        int rows = approvalTaskRepository.updateStatusIfPending(taskId, ApprovalTaskStatus.APPROVED);
        if (rows == 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Task already processed");
        }

        // create audit (TicketApproval)
        Ticket ticket = task.getTicket();
        TicketApproval audit = new TicketApproval();
        audit.setTicket(ticket);
        audit.setApprover(task.getApprover());
        // attempt to populate workflowStep if your ApprovalTask has link to workflow step
        if (task.getWorkflowStep() != null) {
            audit.setWorkflowStep(task.getWorkflowStep());
        }
        audit.setAction(ApprovalAction.valueOf("APPROVE"));
        // set status on audit (optional): you might set the ticket status entity or null
        Optional<TicketStatus> statusOpt = ticketStatusRepository.findByName("APPROVED");
        statusOpt.ifPresent(audit::setStatus);
        audit.setComments(note);
        audit.setCreatedAt(LocalDateTime.now());
        ticketApprovalRepository.save(audit);

        // Lưu lịch sử duyệt
        String fromStatus = ticket.getCurrentStatus().getName();
        String toStatus = "IN_PROGRESS"; // Mặc định chuyển sang IN_PROGRESS
        
        // Kiểm tra xem có còn tầng workflow nào nữa không
        boolean hasMoreSteps = hasMoreWorkflowSteps(ticket, task.getStepIndex());
        
        if (hasMoreSteps) {
            // Còn tầng workflow nữa -> chuyển sang IN_PROGRESS
            ticketStatusRepository.findByName("IN_PROGRESS").ifPresent(ticket::setCurrentStatus);
            toStatus = "IN_PROGRESS";
        } else {
            // Đây là tầng cuối -> chuyển sang COMPLETED
            ticketStatusRepository.findByName("COMPLETED").ifPresent(ticket::setCurrentStatus);
            toStatus = "COMPLETED";
        }
        
        ticketRepository.save(ticket);
        
        // Tạo lịch sử
        ticketHistoryService.createApprovedHistory(ticket, task.getApprover(), note, fromStatus, toStatus);
        
        // re-evaluate whether this step is complete, and advance workflow if needed
        boolean stepComplete = isStepComplete(ticket.getId(), task.getStepIndex());
        if (stepComplete) {
            advanceWorkflowOrFinalize(ticket, task.getStepIndex());
        }
    }

    // --------------- Reject ----------------
    @Transactional
    public void reject(Long taskId, String reason, Long actingUserId) {
        ApprovalTask task = approvalTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Approval task not found"));

        if (task.getApprover() == null || !task.getApprover().getId().equals(actingUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to reject this task");
        }

        int rows = approvalTaskRepository.updateStatusIfPending(taskId, ApprovalTaskStatus.REJECTED);
        if (rows == 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Task already processed");
        }

        // create audit
        TicketApproval audit = new TicketApproval();
        audit.setTicket(task.getTicket());
        audit.setApprover(task.getApprover());
        audit.setWorkflowStep(task.getWorkflowStep());
        audit.setAction(ApprovalAction.valueOf("REJECT"));
        audit.setComments(reason);
        audit.setCreatedAt(LocalDateTime.now());
        ticketApprovalRepository.save(audit);

        // Business policy: mark ticket rejected and cancel other pending tasks in same step
        Ticket ticket = task.getTicket();
        String fromStatus = ticket.getCurrentStatus().getName();
        ticketStatusRepository.findByName("REJECTED").ifPresent(ticket::setCurrentStatus);
        ticketRepository.save(ticket);
        
        // Tạo lịch sử từ chối
        ticketHistoryService.createRejectedHistory(ticket, task.getApprover(), reason, fromStatus, "REJECTED");

        // Cancel other pending tasks in the same step (optional)
        List<ApprovalTask> sameStep = approvalTaskRepository.findByTicketIdOrderByStepIndex(ticket.getId());
        sameStep.stream()
                .filter(t -> t.getStepIndex().equals(task.getStepIndex()))
                .filter(t -> t.getStatus() == ApprovalTaskStatus.PENDING)
                .forEach(t -> {
                    approvalTaskRepository.updateStatusIfPending(t.getId(), ApprovalTaskStatus.REJECTED);
                    TicketApproval cancelAudit = new TicketApproval();
                    cancelAudit.setTicket(ticket);
                    cancelAudit.setApprover(task.getApprover()); // actor who caused cancel
                    cancelAudit.setWorkflowStep(t.getWorkflowStep());
                    cancelAudit.setAction(ApprovalAction.valueOf("REJECT"));
                    cancelAudit.setComments("Auto-cancel due to reject");
                    cancelAudit.setCreatedAt(LocalDateTime.now());
                    ticketApprovalRepository.save(cancelAudit);
                });
    }

    // --------------- Forward ----------------
    @Transactional
    public void forward(Long taskId, Long nextApproverId, String note, Long actingUserId) {
        ApprovalTask task = approvalTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Approval task not found"));

        if (task.getApprover() == null || !task.getApprover().getId().equals(actingUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to forward this task");
        }

        int rows = approvalTaskRepository.updateStatusIfPending(taskId, ApprovalTaskStatus.FORWARDED);
        if (rows == 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Task already processed");
        }

        User next = userRepository.findById(nextApproverId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Next approver not found"));

        // create new task assigned to next approver in same step
        ApprovalTask newTask = new ApprovalTask();
        newTask.setTicket(task.getTicket());
        newTask.setStepIndex(task.getStepIndex());
        newTask.setApprover(next);
        newTask.setApproverRole(next.getRole() != null ? next.getRole().getName() : null);
        newTask.setStatus(ApprovalTaskStatus.PENDING);
        newTask.setAssignedAt(LocalDateTime.from(Instant.now()));
        approvalTaskRepository.save(newTask);

        // audit
        TicketApproval audit = new TicketApproval();
        audit.setTicket(task.getTicket());
        audit.setApprover(task.getApprover()); // original actor
        audit.setWorkflowStep(task.getWorkflowStep());
        audit.setAction(ApprovalAction.valueOf("FORWARD"));
        audit.setComments(note);
        audit.setForwardedToDepartment(next.getDepartment());
        audit.setCreatedAt(LocalDateTime.now());
        ticketApprovalRepository.save(audit);
    }

    // ---------------- helper methods ----------------

    private boolean isStepComplete(Long ticketId, Integer stepIndex) {
        List<ApprovalTask> tasks = approvalTaskRepository.findByTicketIdOrderByStepIndex(ticketId);
        // filter to the step
        List<ApprovalTask> stepTasks = tasks.stream().filter(t -> t.getStepIndex().equals(stepIndex)).toList();

        if (stepTasks.isEmpty()) return true;

        // If only one task or step type sequential (no workflow definition available), treat single approve -> complete
        if (stepTasks.size() == 1) {
            return stepTasks.stream().allMatch(t -> t.getStatus() == ApprovalTaskStatus.APPROVED);
        }

        // If you store workflow definition, you can evaluate rule (all/any) here.
        // For now, fallback: if any APPROVED => complete (you can change to 'all' by config)
        return stepTasks.stream().anyMatch(t -> t.getStatus() == ApprovalTaskStatus.APPROVED);
    }

    private void advanceWorkflowOrFinalize(Ticket ticket, Integer currentStep) {
        // Attempt to load workflow by ticket.formTemplate -> ApprovalWorkflow and create next step tasks.
        // If no workflow or next step, mark ticket final status APPROVED.
        if (ticket.getFormTemplate() != null && approvalWorkflowRepository != null) {
            Optional<ApprovalWorkflow> wfOpt = approvalWorkflowRepository.findById(ticket.getFormTemplate().getId());
            if (wfOpt.isPresent()) {
                // parse JSON and create next tasks - left for your workflow format
                // << implement per your ApprovalWorkflow.definition JSON >>
                return;
            }
        }
        // fallback: mark ticket as final APPROVED
        ticketStatusRepository.findByName("APPROVED").ifPresent(ticket::setCurrentStatus);
        ticketRepository.save(ticket);
    }
    
    /**
     * Kiểm tra xem ticket có còn tầng workflow nào nữa không
     */
    private boolean hasMoreWorkflowSteps(Ticket ticket, Integer currentStepIndex) {
        if (ticket.getFormTemplate() == null || ticket.getFormTemplate().getApprovalWorkflows() == null) {
            return false;
        }
        
        List<ApprovalWorkflow> workflows = ticket.getFormTemplate().getApprovalWorkflows();
        
        // Kiểm tra xem có tầng nào có stepOrder lớn hơn currentStepIndex không
        return workflows.stream()
                .anyMatch(workflow -> workflow.getStepOrder() > currentStepIndex);
    }

    /**
     * Create approval tasks with specific approvers from workflow
     */
    @Transactional
    public void createApprovalTasksWithSpecificApprovers(Ticket ticket, Map<Long, String> workflowApprovers) {
        if (ticket.getFormTemplate() == null || ticket.getFormTemplate().getApprovalWorkflows().isEmpty()) {
            return;
        }

        List<ApprovalWorkflow> workflows = ticket.getFormTemplate().getApprovalWorkflows();
        
        for (ApprovalWorkflow workflow : workflows) {
            String approverValue = workflowApprovers.get(workflow.getId());
            
            ApprovalTask task = new ApprovalTask();
            task.setTicket(ticket);
            task.setStepIndex(workflow.getStepOrder()); // Use stepIndex instead of stepOrder
            task.setWorkflowStep(workflow); // Link to workflow step
            task.setStatus(ApprovalTaskStatus.PENDING);
            task.setAssignedAt(LocalDateTime.now());
            
            User resolvedApprover = null;
            
            // Set specific approver if not "any"
            if (approverValue != null && !"any".equals(approverValue) && !approverValue.trim().isEmpty()) {
                try {
                    Long approverId = Long.parseLong(approverValue.trim());
                    User approver = userRepository.findById(approverId)
                            .orElseThrow(() -> new RuntimeException("Approver not found: " + approverId));
                    resolvedApprover = approver;
                    task.setApprover(approver);
                    task.setApproverRole(approver.getRole() != null ? approver.getRole().getName() : null);
                } catch (NumberFormatException e) {
                    System.err.println("Invalid approver ID format: " + approverValue + " for workflow step: " + workflow.getId());
                    // Leave approver null for department-level approval
                }
            }
            // If approver is null, it means any approver in the department can approve
            
            approvalTaskRepository.save(task);

            // Also create an initial TicketApproval (audit) record in PENDING state
            TicketApproval pendingAudit = new TicketApproval();
            pendingAudit.setTicket(ticket);
            pendingAudit.setWorkflowStep(workflow);
            ticketStatusRepository.findByName("PENDING").ifPresent(pendingAudit::setStatus);
            // Store who is assigned if present; otherwise keep null (department-level)
            if (resolvedApprover != null) {
                pendingAudit.setApprover(resolvedApprover);
            }
            // Some schemas include PENDING in ApprovalAction; fallback to APPROVE if not present
            try {
                pendingAudit.setAction(ApprovalAction.valueOf("PENDING"));
            } catch (IllegalArgumentException ex) {
                // If PENDING is not a valid action in enum, skip setting action here
            }
            ticketApprovalRepository.save(pendingAudit);
        }
    }

    /**
     * Flexible version: accepts raw String keys (could be workflowStepId or stepOrder)
     */
    @Transactional
    public void createApprovalTasksWithFlexibleApprovers(Ticket ticket, Map<String, String> rawApprovers) {
        if (ticket.getFormTemplate() == null || ticket.getFormTemplate().getApprovalWorkflows() == null) return;
        List<ApprovalWorkflow> workflows = ticket.getFormTemplate().getApprovalWorkflows();
        if (workflows.isEmpty() || rawApprovers == null || rawApprovers.isEmpty()) return;

        // Build normalized map: workflowStepId -> approverId
        Map<Long, String> normalized = new java.util.HashMap<>();
        for (ApprovalWorkflow wf : workflows) {
            String byId = rawApprovers.get(String.valueOf(wf.getId()));
            String byOrder = rawApprovers.get(String.valueOf(wf.getStepOrder()));
            String picked = (byId != null && !byId.isBlank()) ? byId : byOrder;
            if (picked != null && !picked.isBlank() && !"any".equalsIgnoreCase(picked)) {
                normalized.put(wf.getId(), picked.trim());
            }
        }

        createApprovalTasksWithSpecificApprovers(ticket, normalized);
    }

    /**
     * Create approval tasks from template workflow without assigning specific approvers.
     * Approver will be determined at runtime based on department/role policies.
     */
    @Transactional
    public void createApprovalTasksFromTemplate(Ticket ticket) {
        if (ticket.getFormTemplate() == null || ticket.getFormTemplate().getApprovalWorkflows() == null
                || ticket.getFormTemplate().getApprovalWorkflows().isEmpty()) {
            return;
        }

        List<ApprovalWorkflow> workflows = ticket.getFormTemplate().getApprovalWorkflows();
        for (ApprovalWorkflow workflow : workflows) {
            ApprovalTask task = new ApprovalTask();
            task.setTicket(ticket);
            task.setStepIndex(workflow.getStepOrder());
            task.setWorkflowStep(workflow);
            task.setStatus(ApprovalTaskStatus.PENDING);
            task.setAssignedAt(LocalDateTime.now());
            // approver left null => any eligible approver can claim/act based on department/role
            approvalTaskRepository.save(task);

            // Also seed a TicketApproval audit row in PENDING state
            TicketApproval pendingAudit = new TicketApproval();
            pendingAudit.setTicket(ticket);
            pendingAudit.setWorkflowStep(workflow);
            pendingAudit.setUpdatedAt(LocalDateTime.now());
            // status = PENDING if exists
            ticketStatusRepository.findByName("PENDING").ifPresent(pendingAudit::setStatus);
            // No specific approver assigned for template path
            try {
                pendingAudit.setAction(ApprovalAction.valueOf("PENDING"));
            } catch (IllegalArgumentException ignored) {}
            ticketApprovalRepository.save(pendingAudit);
        }
    }

    // --------------- New Methods for Approver Dashboard ----------------

    /**
     * Approve ticket directly from TicketApproval (for frontend integration)
     */
    @Transactional
    public void approveTicketApproval(Long ticketApprovalId, String note, Long actingUserId) {
        TicketApproval ticketApproval = ticketApprovalRepository.findById(ticketApprovalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket approval not found"));

        // Check if this approval belongs to the acting user
        if (ticketApproval.getApprover() == null || !ticketApproval.getApprover().getId().equals(actingUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to approve this ticket");
        }

        // Check if already processed
        if (!ApprovalAction.PENDING.equals(ticketApproval.getAction())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ticket already processed");
        }

        // Kiểm tra xem tầng trước đó đã được duyệt chưa
        Integer currentStepOrder = ticketApproval.getWorkflowStep().getStepOrder();
        long pendingPreviousSteps = ticketApprovalRepository.countPendingPreviousSteps(ticketApproval.getTicket().getId(), currentStepOrder);
        if (pendingPreviousSteps > 0) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                "Cannot approve this step. Previous workflow steps are still pending. Please wait for previous approvals.");
        }

        // Update the TicketApproval record
        ticketApproval.setAction(ApprovalAction.APPROVE);
        ticketApproval.setComments(note);
//        ticketApproval.setUpdatedAt(LocalDateTime.now());
        ticketApprovalRepository.save(ticketApproval);

        // Update ticket status
        Ticket ticket = ticketApproval.getTicket();
        String fromStatus = ticket.getCurrentStatus().getName();
        String toStatus;

        // Check if there are more workflow steps
        boolean hasMoreSteps = hasMoreWorkflowSteps(ticket, ticketApproval.getWorkflowStep().getStepOrder());
        
        if (hasMoreSteps) {
            // More steps to go -> set to IN_PROGRESS
            ticketStatusRepository.findByName("IN_PROGRESS").ifPresent(ticket::setCurrentStatus);
            toStatus = "IN_PROGRESS";
        } else {
            // Final step -> set to COMPLETED
            ticketStatusRepository.findByName("COMPLETED").ifPresent(ticket::setCurrentStatus);
            toStatus = "COMPLETED";
        }
        
        ticketRepository.save(ticket);
        
        // Create history
        ticketHistoryService.createApprovedHistory(ticket, ticketApproval.getApprover(), note, fromStatus, toStatus);
    }

    /**
     * Reject ticket directly from TicketApproval (for frontend integration)
     */
    @Transactional
    public void rejectTicketApproval(Long ticketApprovalId, String reason, Long actingUserId) {
        TicketApproval ticketApproval = ticketApprovalRepository.findById(ticketApprovalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket approval not found"));

        // Check if this approval belongs to the acting user
        if (ticketApproval.getApprover() == null || !ticketApproval.getApprover().getId().equals(actingUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to reject this ticket");
        }

        // Check if already processed
        if (!ApprovalAction.PENDING.equals(ticketApproval.getAction())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ticket already processed");
        }

        // Kiểm tra xem tầng trước đó đã được duyệt chưa
        Integer currentStepOrder = ticketApproval.getWorkflowStep().getStepOrder();
        long pendingPreviousSteps = ticketApprovalRepository.countPendingPreviousSteps(ticketApproval.getTicket().getId(), currentStepOrder);
        if (pendingPreviousSteps > 0) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                "Cannot reject this step. Previous workflow steps are still pending. Please wait for previous approvals.");
        }

        // Update the TicketApproval record
        ticketApproval.setAction(ApprovalAction.REJECT);
        ticketApproval.setComments(reason);
//        ticketApproval.setCreatedAt(LocalDateTime.now());
        ticketApprovalRepository.save(ticketApproval);

        // Update ticket status to REJECTED
        Ticket ticket = ticketApproval.getTicket();
        String fromStatus = ticket.getCurrentStatus().getName();
        ticketStatusRepository.findByName("REJECTED").ifPresent(ticket::setCurrentStatus);
        ticketRepository.save(ticket);

        // Create history
        ticketHistoryService.createRejectedHistory(ticket, ticketApproval.getApprover(), reason, fromStatus, "REJECTED");

        // Đổi trạng thái các TicketApproval phía sau thành REJECT
        Integer rejectionStepOrder = ticketApproval.getWorkflowStep().getStepOrder();
        List<TicketApproval> laterApprovals = ticketApprovalRepository.findByTicketIdAndStepOrderGreaterThan(
            ticket.getId(), rejectionStepOrder
        );
        for (TicketApproval ta : laterApprovals) {
            if (ApprovalAction.PENDING.equals(ta.getAction())) {
                ta.setAction(ApprovalAction.REJECT);
                ta.setComments("Auto-rejected due to previous rejection");
                ta.setCreatedAt(LocalDateTime.now());
                ticketApprovalRepository.save(ta);
            }
        }
    }

    /**
     * Get approval statistics for specific approver
     */
    public ApprovalStatsDto getApprovalStats(Long approverId) {
        long pending = ticketApprovalRepository.countPendingForApprover(approverId);
        long processed = ticketApprovalRepository.countProcessedByApprover(approverId);
        long approved = ticketApprovalRepository.countApprovedByApprover(approverId);
        long rejected = ticketApprovalRepository.countRejectedByApprover(approverId);
        
        return new ApprovalStatsDto(pending, processed, approved, rejected);
    }

    /**
     * Get pending tickets for specific approver with filters - NEW VERSION using TicketApproval
     */
    public Page<TicketApproval> getPendingTicketsForApprover(Long approverId, Long departmentId, 
                                                         Long formTemplateId, String priority, 
                                                         String employeeCode, String q, 
                                                         Pageable pageable) {
        return ticketApprovalRepository.findPendingForApprover(approverId, departmentId, formTemplateId, 
                                                           priority, employeeCode, q, pageable);
    }

    /**
     * Get processed tickets by specific approver with filters - NEW VERSION using TicketApproval
     */
    public Page<TicketApproval> getProcessedTicketsForApprover(Long approverId, Long departmentId, 
                                                           Long formTemplateId, String priority, 
                                                           String employeeCode, String q, 
                                                           Pageable pageable) {
        return ticketApprovalRepository.findProcessedByApprover(approverId, departmentId, formTemplateId, 
                                                            priority, employeeCode, q, pageable);
    }
}
