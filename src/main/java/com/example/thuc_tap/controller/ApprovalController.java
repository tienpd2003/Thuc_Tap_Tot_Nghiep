package com.example.thuc_tap.controller;

import com.example.thuc_tap.dto.request.ApproveRequest;
import com.example.thuc_tap.dto.request.RejectRequest;
import com.example.thuc_tap.dto.request.ForwardRequest;
import com.example.thuc_tap.entity.ApprovalTask;
import com.example.thuc_tap.service.ApprovalService;
import com.example.thuc_tap.repository.ApprovalTaskRepository;
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

    public ApprovalController(ApprovalService approvalService,
                              ApprovalTaskRepository approvalTaskRepository) {
        this.approvalService = approvalService;
        this.approvalTaskRepository = approvalTaskRepository;
    }

    // Pending queue with filters (pageable)
    @GetMapping("/pending")
    public ResponseEntity<Page<ApprovalTask>> pending(@RequestParam(required=false) Long departmentId,
                                                      @RequestParam(required=false) Long type,
                                                      @RequestParam(required=false) Long priority,
                                                      @RequestParam(required=false) String q,
                                                      Pageable pageable) {
        Page<ApprovalTask> page = approvalTaskRepository.findPendingFiltered(departmentId, type, priority, q, pageable);
        return ResponseEntity.ok(page);
    }

    // Ticket details + approvals history — you can implement a DTO wrapper
    @GetMapping("/{ticketId}")
    public ResponseEntity<?> ticketApprovals(@PathVariable Long ticketId) {
        // implement in service to return ticket, tasks, and ticket_approvals
        return ResponseEntity.ok().build();
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
        // DEV: return a test user id (e.g. 1L)
        // PROD: replace with SecurityContextHolder retrieval
        return 1L;
    }
}
