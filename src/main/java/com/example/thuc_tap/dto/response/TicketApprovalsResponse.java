package com.example.thuc_tap.dto.response;

import com.example.thuc_tap.dto.TicketApprovalDto;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class TicketApprovalsResponse {
    private Long ticketId;
    private String ticketCode;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime dueDate;
    private Long requesterId;
    private String requesterName;
    private String currentStatus;
    private String departmentName;
    private String formTemplateName;
    private String priorityName;
    private Map<String, Object> formData;
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

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getFormTemplateName() { return formTemplateName; }
    public void setFormTemplateName(String formTemplateName) { this.formTemplateName = formTemplateName; }

    public String getPriorityName() { return priorityName; }
    public void setPriorityName(String priorityName) { this.priorityName = priorityName; }

    public Map<String, Object> getFormData() { return formData; }
    public void setFormData(Map<String, Object> formData) { this.formData = formData; }

    public List<TicketApprovalDto> getApprovals() { return approvals; }
    public void setApprovals(List<TicketApprovalDto> approvals) { this.approvals = approvals; }

    public TicketApprovalDto getNextPending() { return nextPending; }
    public void setNextPending(TicketApprovalDto nextPending) { this.nextPending = nextPending; }
}
