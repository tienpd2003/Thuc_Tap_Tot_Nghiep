package com.example.thuc_tap.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * DTO cho danh sách người dùng mới đăng ký
 * Dùng cho phần "Recent Users" trong Admin Dashboard
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentUserDto {
    
    private Long id;
    private String employeeCode;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    
    // Thông tin phòng ban và vai trò
    private String departmentName;
    private String roleName;
    
    // Trạng thái và thời gian
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;      // Thời gian đăng nhập gần nhất
    
    // Để hiển thị trên UI
    private String timeAgo;                 // "2 giờ trước", "1 ngày trước"
    private String statusLabel;             // "Hoạt động", "Vắng mặt", "Chưa kích hoạt"
    private String roleLabel;               // "Quản trị viên", "Nhân viên", "Người phê duyệt"
    
    // Thống kê hoạt động
    private Long totalTicketsCreated;       // Số lượng ticket đã tạo
    private LocalDateTime lastActivityAt;   // Hoạt động cuối cùng
}
