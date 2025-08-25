package com.example.thuc_tap.dto.response;

public class ApprovalStatsDto {
    private Long pendingTickets;
    private Long processedTickets;
    private Long approvedTickets;
    private Long rejectedTickets;

    public ApprovalStatsDto() {}

    public ApprovalStatsDto(Long pendingTickets, Long processedTickets, Long approvedTickets, Long rejectedTickets) {
        this.pendingTickets = pendingTickets;
        this.processedTickets = processedTickets;
        this.approvedTickets = approvedTickets;
        this.rejectedTickets = rejectedTickets;
    }

    // Getters and setters
    public Long getPendingTickets() {
        return pendingTickets;
    }

    public void setPendingTickets(Long pendingTickets) {
        this.pendingTickets = pendingTickets;
    }

    public Long getProcessedTickets() {
        return processedTickets;
    }

    public void setProcessedTickets(Long processedTickets) {
        this.processedTickets = processedTickets;
    }

    public Long getApprovedTickets() {
        return approvedTickets;
    }

    public void setApprovedTickets(Long approvedTickets) {
        this.approvedTickets = approvedTickets;
    }

    public Long getRejectedTickets() {
        return rejectedTickets;
    }

    public void setRejectedTickets(Long rejectedTickets) {
        this.rejectedTickets = rejectedTickets;
    }
}
