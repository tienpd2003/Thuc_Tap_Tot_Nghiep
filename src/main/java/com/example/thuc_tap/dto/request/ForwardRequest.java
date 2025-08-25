package com.example.thuc_tap.dto.request;

public class ForwardRequest {
    private Long taskId;
    private Long nextApproverId;
    private String note;
    
    // Getters and Setters
    public Long getTaskId() {
        return taskId;
    }
    
    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }
    
    public Long getNextApproverId() {
        return nextApproverId;
    }
    
    public void setNextApproverId(Long nextApproverId) {
        this.nextApproverId = nextApproverId;
    }
    
    public String getNote() {
        return note;
    }
    
    public void setNote(String note) {
        this.note = note;
    }
}