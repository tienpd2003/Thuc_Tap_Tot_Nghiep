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
    
    // Thống kê theo trạng thái ticket
    private Long pendingTickets;
    private Long approvedTickets;
    private Long rejectedTickets;
    private Long inProgressTickets;
    
    // Tỷ lệ xử lý
    private Double approvalRate;       // Tỷ lệ duyệt (approved / total)
    private Double rejectionRate;      // Tỷ lệ từ chối (rejected / total)
    private Double processingRate;     // Tỷ lệ đang xử lý (pending + in_progress / total)
    
    // Thống kê theo thời gian
    private LocalDateTime lastUpdated;
    private String period; // "week", "month", "year"
    
    // Thống kê chi tiết theo phòng ban
    private List<DepartmentStatsDto> departmentStats;
    
    // Thống kê ticket theo ngày (cho biểu đồ)
    private List<DailyTicketStatsDto> dailyStats;
}
