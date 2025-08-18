package com.example.thuc_tap.entity;

public enum ApprovalTaskStatus {
    PENDING,      // waiting to be handled
    IN_PROGRESS,  // someone started it / assigned
    APPROVED,
    REJECTED,
    FORWARDED
}
