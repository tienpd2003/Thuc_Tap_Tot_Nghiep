package com.example.thuc_tap.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO cho thống kê phòng ban
 * Dùng cho admin dashboard để hiển thị hiệu suất từng phòng ban
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentStatsDto {
    
    private Long departmentId;
    private String departmentName;
    
    // Thống kê ticket của phòng ban (PENDING, IN_PROGRESS, REJECTED, CANCELLED, COMPLETED)
    private Long totalTickets;
    private Long pendingTickets;
    private Long approvedTickets;      // Thực chất là completedTickets (COMPLETED status)
    private Long rejectedTickets;      // Bao gồm REJECTED + CANCELLED
    private Long inProgressTickets;
    
    // Thống kê người dùng
    private Long totalUsers;
    private Long activeUsers;
    
    // Tỷ lệ hiệu suất
    private Double approvalRate;       // Thực chất là completion rate (completed / total * 100)
    private Double averageProcessingTime; // Thời gian xử lý trung bình (giờ)
    
    // Xếp hạng hiệu suất
    private Integer performanceRank;   // Thứ hạng về hiệu suất (1 = tốt nhất)
}
