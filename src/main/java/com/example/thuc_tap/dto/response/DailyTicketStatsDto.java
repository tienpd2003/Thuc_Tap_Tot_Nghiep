package com.example.thuc_tap.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

/**
 * DTO cho thống kê ticket theo ngày
 * Dùng để hiển thị biểu đồ xu hướng ticket theo thời gian
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyTicketStatsDto {
    
    private LocalDate date;
    
    // Số lượng ticket theo trạng thái trong ngày (PENDING, IN_PROGRESS, REJECTED, CANCELLED, COMPLETED)
    private Long createdTickets;   // Ticket được tạo mới
    private Long approvedTickets;  // Ticket được hoàn thành (COMPLETED status)
    private Long rejectedTickets;  // Ticket bị từ chối/hủy (REJECTED + CANCELLED status)
    private Long pendingTickets;   // Ticket đang chờ xử lý
    
    // Tổng số ticket hoạt động trong ngày
    private Long totalActiveTickets;
    
    // Để hiển thị trên biểu đồ
    private String dateString;     // Format: "2025-08-18"
    private String dayOfWeek;      // "Monday", "Tuesday", etc.
}
