package com.example.thuc_tap.controller;

import com.example.thuc_tap.dto.response.AdminDashboardStatsDto;
import com.example.thuc_tap.dto.response.DailyTicketStatsDto;
import com.example.thuc_tap.dto.response.DepartmentStatsDto;
import com.example.thuc_tap.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller xử lý các API cho Admin Dashboard và thống kê
 * TODO: Thêm security để chỉ ADMIN mới có quyền truy cập
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RequiredArgsConstructor
public class AdminController {

    private final AdminStatsService adminStatsService;

    /**
     * API lấy thống kê tổng quan cho dashboard
     * GET /api/admin/stats/overview?period=week|month|year
     */
    @GetMapping("/stats/overview")
    public ResponseEntity<AdminDashboardStatsDto> getOverviewStats(
            @RequestParam(defaultValue = "month") String period) {
        
        // Validate period parameter
        if (!isValidPeriod(period)) {
            period = "month"; // fallback to default
        }
        
        AdminDashboardStatsDto stats = adminStatsService.getOverviewStats(period);
        return ResponseEntity.ok(stats);
    }

    /**
     * API lấy thống kê theo phòng ban
     * GET /api/admin/stats/departments?period=week|month|year
     */
    @GetMapping("/stats/departments")
    public ResponseEntity<List<DepartmentStatsDto>> getDepartmentStats(
            @RequestParam(defaultValue = "month") String period) {
        
        if (!isValidPeriod(period)) {
            period = "month";
        }
        
        List<DepartmentStatsDto> departmentStats = adminStatsService.getDepartmentStats(period);
        return ResponseEntity.ok(departmentStats);
    }

    /**
     * API lấy thống kê ticket theo ngày (cho biểu đồ xu hướng)
     * GET /api/admin/stats/daily?days=7|30|365
     */
    @GetMapping("/stats/daily")
    public ResponseEntity<List<DailyTicketStatsDto>> getDailyStats(
            @RequestParam(defaultValue = "30") int days) {
        
        // Validate days parameter
        if (days <= 0 || days > 365) {
            days = 30; // fallback to default
        }
        
        List<DailyTicketStatsDto> dailyStats = adminStatsService.getDailyStats(days);
        return ResponseEntity.ok(dailyStats);
    }

    /**
     * API lấy thống kê nhanh (metrics đơn giản)
     * GET /api/admin/stats/quick
     * - Cho các widget nhỏ trên dashboard
     */
    @GetMapping("/stats/quick")
    public ResponseEntity<QuickStatsDto> getQuickStats() {
        AdminDashboardStatsDto fullStats = adminStatsService.getOverviewStats("month");
        
        QuickStatsDto quickStats = QuickStatsDto.builder()
                .totalTickets(fullStats.getTotalTickets())
                .totalUsers(fullStats.getTotalUsers())
                .pendingTickets(fullStats.getPendingTickets())
                .approvalRate(fullStats.getApprovalRate())
                .build();
        
        return ResponseEntity.ok(quickStats);
    }

    // ========== HELPER METHODS ==========
    
    /**
     * Kiểm tra tham số period có hợp lệ không
     */
    private boolean isValidPeriod(String period) {
        return period != null && 
               (period.equals("week") || period.equals("month") || period.equals("year"));
    }

    // ========== INNER DTO CLASS ==========
    
    /**
     * DTO cho thống kê nhanh (metrics cơ bản)
     */
    @lombok.Builder
    @lombok.Data
    public static class QuickStatsDto {
        private Long totalTickets;
        private Long totalUsers;
        private Long pendingTickets;
        private Double approvalRate;
    }
}
