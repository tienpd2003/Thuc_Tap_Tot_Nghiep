package com.example.thuc_tap.dto.request;
import lombok.Data;
@Data
public class ForwardRequest {
    private Long taskId;
    private Long nextApproverId;
    private String note;
}