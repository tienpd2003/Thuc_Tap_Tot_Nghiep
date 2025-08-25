package com.example.thuc_tap.controller;

import com.example.thuc_tap.dto.request.ApproveRequest;
import com.example.thuc_tap.dto.request.RejectRequest;
import com.example.thuc_tap.dto.request.ForwardRequest;
import com.example.thuc_tap.dto.response.TicketApprovalsResponse;
import com.example.thuc_tap.entity.ApprovalTask;
import com.example.thuc_tap.entity.Ticket;
import com.example.thuc_tap.entity.TicketApproval;
import com.example.thuc_tap.service.ApprovalService;
import com.example.thuc_tap.repository.ApprovalTaskRepository;
import com.example.thuc_tap.service.TicketApprovalService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/approvals")
@CrossOrigin(origins = "*")
public class ApprovalController {

    private final ApprovalService approvalService;
    private final ApprovalTaskRepository approvalTaskRepository;
    private final TicketApprovalService ticketApprovalService;

    public ApprovalController(ApprovalService approvalService,
                              ApprovalTaskRepository approvalTaskRepository, TicketApprovalService ticketApprovalService) {
        this.approvalService = approvalService;
        this.approvalTaskRepository = approvalTaskRepository;
        this.ticketApprovalService = ticketApprovalService;
    }

    // Statistics for approver dashboard
    @GetMapping("/stats")
    public ResponseEntity<?> getApprovalStats(@RequestParam(required = true) Long approverId) {
        return ResponseEntity.ok(approvalService.getApprovalStats(approverId));
    }

    // Pending queue with filters (pageable)
    @GetMapping("/pending")
    public ResponseEntity<Page<TicketApproval>> pending(@RequestParam(required=true) Long approverId,
                                                      @RequestParam(required=false) Long departmentId,
                                                      @RequestParam(required=false) Long formTemplateId,
                                                      @RequestParam(required=false) String priority,
                                                      @RequestParam(required=false) String employeeCode,
                                                      @RequestParam(required=false) String q,
                                                      Pageable pageable) {
        Page<TicketApproval> page = approvalService.getPendingTicketsForApprover(approverId, departmentId, formTemplateId, priority, employeeCode, q, pageable);
        return ResponseEntity.ok(page);
    }

    // Processed tickets by approver
    @GetMapping("/processed")
    public ResponseEntity<Page<TicketApproval>> processed(@RequestParam(required=true) Long approverId,
                                                        @RequestParam(required=false) Long departmentId,
                                                        @RequestParam(required=false) Long formTemplateId,
                                                        @RequestParam(required=false) String priority,
                                                        @RequestParam(required=false) String employeeCode,
                                                        @RequestParam(required=false) String q,
                                                        Pageable pageable) {
        Page<TicketApproval> page = approvalService.getProcessedTicketsForApprover(approverId, departmentId, formTemplateId, priority, employeeCode, q, pageable);
        return ResponseEntity.ok(page);
    }

    // Ticket details + approvals history — you can implement a DTO wrapper
    @GetMapping("/{ticketId}/detail")
    public ResponseEntity<TicketApprovalsResponse> ticketApprovals(@PathVariable Long ticketId) {
        TicketApprovalsResponse payload = ticketApprovalService.getTicketApprovalsPayload(ticketId);
        return ResponseEntity.ok(payload);
    }

    @PostMapping("/{ticketId}/approve")
    public ResponseEntity<Void> approve(@PathVariable Long ticketId, @RequestBody ApproveRequest req) {
        Long actingUserId = getCurrentUserId();
        approvalService.approve(req.getTaskId(), req.getNote(), actingUserId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{ticketId}/reject")
    public ResponseEntity<Void> reject(@PathVariable Long ticketId, @RequestBody RejectRequest req) {
        Long actingUserId = getCurrentUserId();
        approvalService.reject(req.getTaskId(), req.getReason(), actingUserId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{ticketId}/forward")
    public ResponseEntity<Void> forward(@PathVariable Long ticketId, @RequestBody ForwardRequest req) {
        Long actingUserId = getCurrentUserId();
        approvalService.forward(req.getTaskId(), req.getNextApproverId(), req.getNote(), actingUserId);
        return ResponseEntity.ok().build();
    }

    private Long getCurrentUserId() {
        // DEV: return a test user id - Nguyễn Thị Hoa
        // PROD: replace with SecurityContextHolder retrieval
        return 4L; // TODO: Get from SecurityContextHolder
    }
}
