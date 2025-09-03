package com.example.thuc_tap.dto.request;

import lombok.Data;

@Data
public class RejectRequest {
    private Long taskId;
    private String reason;
    private Long actingUserId;
}