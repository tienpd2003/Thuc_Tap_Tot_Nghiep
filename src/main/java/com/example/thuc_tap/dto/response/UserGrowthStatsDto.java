package com.example.thuc_tap.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;

/**
 * DTO cho thống kê tăng trưởng người dùng theo thời gian
 * Dùng để hiển thị biểu đồ UserGrowthChart
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserGrowthStatsDto {
    
    private LocalDate date;
    
    // Số lượng người dùng
    private Long totalUsers;        // Tổng số người dùng tích lũy đến ngày này
    private Long newUsers;          // Số người dùng mới đăng ký trong ngày
    private Long activeUsers;       // Số người dùng hoạt động trong ngày (có login/tạo ticket)
    
    // Để hiển thị trên biểu đồ frontend
    private String month;           // Format: "Tháng 1", "Tháng 2", etc. hoặc "Tuần 1", "Tuần 2"
    private String dateString;      // Format: "2025-09-02"
    private String dayOfWeek;       // "Monday", "Tuesday", etc.
    
    // Thống kê bổ sung
    private Long deactivatedUsers;  // Số người dùng bị vô hiệu hóa trong ngày
    private Double growthRate;      // Tỷ lệ tăng trưởng so với kỳ trước (%)
}
