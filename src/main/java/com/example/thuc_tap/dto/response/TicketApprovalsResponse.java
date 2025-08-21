package com.example.thuc_tap.dto.response;

import com.example.thuc_tap.dto.TicketApprovalDto;
import java.time.LocalDateTime;
import java.util.List;

public class TicketApprovalsResponse {
    private Long ticketId;
    private String ticketCode;
    private String title;
    private LocalDateTime createdAt;
    private Long requesterId;
    private String requesterName;
    private String currentStatus;
    private List<TicketApprovalDto> approvals;
    private TicketApprovalDto nextPending;

    // getters / setters
    public Long getTicketId() { return ticketId; }
    public void setTicketId(Long ticketId) { this.ticketId = ticketId; }

    public String getTicketCode() { return ticketCode; }
    public void setTicketCode(String ticketCode) { this.ticketCode = ticketCode; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getRequesterId() { return requesterId; }
    public void setRequesterId(Long requesterId) { this.requesterId = requesterId; }

    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }

    public String getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(String currentStatus) { this.currentStatus = currentStatus; }

    public List<TicketApprovalDto> getApprovals() { return approvals; }
    public void setApprovals(List<TicketApprovalDto> approvals) { this.approvals = approvals; }

    public TicketApprovalDto getNextPending() { return nextPending; }
    public void setNextPending(TicketApprovalDto nextPending) { this.nextPending = nextPending; }
}
