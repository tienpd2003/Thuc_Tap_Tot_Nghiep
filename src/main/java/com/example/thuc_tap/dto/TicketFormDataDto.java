package com.example.thuc_tap.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketFormDataDto {
    
    private Long id;
    private Long ticketId;
    private Long fieldId;
    private String fieldName;
    private String fieldLabel;
    private String fieldValue;
    private String filePath;
    private String fieldType;
}
