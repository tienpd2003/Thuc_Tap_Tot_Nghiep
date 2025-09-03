package com.example.thuc_tap.dto.request;

public class RejectRequest {
    private Long taskId;
    private String reason;
    private Long actingUserId;
    
    // Getters and Setters
    public Long getTaskId() {
        return taskId;
    }
    
    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }
    
    public String getReason() {
        return reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }

    public Long getActingUserId() {
        return actingUserId;
    }

    public void setActingUserId(Long actingUserId) {
        this.actingUserId = actingUserId;
    }
}