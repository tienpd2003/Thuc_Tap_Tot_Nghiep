package com.example.thuc_tap.service;

import com.example.thuc_tap.entity.*;
import com.example.thuc_tap.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
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
        ticketStatusRepository.findByName("REJECTED").ifPresent(ticket::setCurrentStatus);
        ticketRepository.save(ticket);

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
}
