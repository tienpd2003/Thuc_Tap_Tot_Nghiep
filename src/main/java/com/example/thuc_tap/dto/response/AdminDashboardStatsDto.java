package com.example.thuc_tap.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * DTO cho Admin Dashboard Statistics
 * Dùng để hiển thị thống kê tổng quan hệ thống
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStatsDto {
    
    // Thống kê tổng quan
    private Long totalTickets;
    private Long totalUsers;
    private Long totalDepartments;
    private Long activeUsers;
    
    // Thống kê theo trạng thái ticket (PENDING, IN_PROGRESS, REJECTED, CANCELLED, COMPLETED)
    private Long pendingTickets;
    private Long approvedTickets;      // Thực chất là completedTickets (COMPLETED status)
    private Long rejectedTickets;      // Bao gồm REJECTED + CANCELLED
    private Long inProgressTickets;
    
    // Tỷ lệ xử lý
    private Double approvalRate;       // Thực chất là completion rate (completed / total * 100)
    private Double rejectionRate;      // Tỷ lệ từ chối + hủy (rejected + cancelled / total * 100)
    private Double processingRate;     // Tỷ lệ đang xử lý (pending + in_progress / total * 100)
    
    // Thống kê theo thời gian
    private LocalDateTime lastUpdated;
    private String period; // "week", "month", "year"
    
    // Thống kê chi tiết theo phòng ban
    private List<DepartmentStatsDto> departmentStats;
    
    // Thống kê ticket theo ngày (cho biểu đồ)
    private List<DailyTicketStatsDto> dailyStats;
}
