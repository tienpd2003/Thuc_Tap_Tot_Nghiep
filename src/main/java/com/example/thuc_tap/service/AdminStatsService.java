package com.example.thuc_tap.service;

import com.example.thuc_tap.dto.response.AdminDashboardStatsDto;
import com.example.thuc_tap.dto.response.DailyTicketStatsDto;
import com.example.thuc_tap.dto.response.DepartmentStatsDto;
import com.example.thuc_tap.entity.Department;
import com.example.thuc_tap.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service cho Admin Dashboard và thống kê hệ thống
 * Xử lý logic nghiệp vụ cho các chức năng thống kê, báo cáo
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Chủ yếu là các truy vấn đọc dữ liệu
public class AdminStatsService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final TicketRepository ticketRepository;

    /**
     * Lấy thống kê tổng quan cho admin dashboard
     * @param period "week", "month", "year" - thời kỳ thống kê
     * @return AdminDashboardStatsDto chứa tất cả thống kê cần thiết
     */
    public AdminDashboardStatsDto getOverviewStats(String period) {
        AdminDashboardStatsDto stats = new AdminDashboardStatsDto();
        
        // Thống kê cơ bản
        stats.setTotalTickets(ticketRepository.count());
        stats.setTotalUsers(userRepository.count());
        stats.setTotalDepartments(departmentRepository.count());
        stats.setActiveUsers(userRepository.countByIsActive(true));
        
        // Thống kê theo trạng thái thực tế (PENDING, IN_PROGRESS, REJECTED, CANCELLED, COMPLETED)
        Map<String, Long> statusCounts = getTicketStatusCounts();
        stats.setPendingTickets(statusCounts.getOrDefault("PENDING", 0L));
        stats.setApprovedTickets(statusCounts.getOrDefault("COMPLETED", 0L)); // COMPLETED thay vì APPROVED
        stats.setRejectedTickets(statusCounts.getOrDefault("REJECTED", 0L));
        stats.setInProgressTickets(statusCounts.getOrDefault("IN_PROGRESS", 0L));
        Long cancelledTickets = statusCounts.getOrDefault("CANCELLED", 0L);
        
        // Tính tỷ lệ hoàn thành (completion rate) thay vì approval rate
        if (stats.getTotalTickets() > 0) {
            stats.setApprovalRate((double) stats.getApprovedTickets() / stats.getTotalTickets() * 100); // Thực chất là completion rate
            stats.setRejectionRate((double) (stats.getRejectedTickets() + cancelledTickets) / stats.getTotalTickets() * 100);
        } else {
            stats.setApprovalRate(0.0);
            stats.setRejectionRate(0.0);
        }
        
        // Tỷ lệ đang xử lý (pending + in_progress)
        long totalActiveTickets = stats.getPendingTickets() + stats.getInProgressTickets();
        if (stats.getTotalTickets() > 0) {
            stats.setProcessingRate((double) totalActiveTickets / stats.getTotalTickets() * 100);
        } else {
            stats.setProcessingRate(0.0);
        }
        
        // Metadata
        stats.setPeriod(period);
        stats.setLastUpdated(LocalDateTime.now());
        
        // Thống kê theo phòng ban
        stats.setDepartmentStats(getDepartmentStats(period));
        
        // Thống kê theo ngày (cho biểu đồ)
        int days = period.equals("week") ? 7 : (period.equals("month") ? 30 : 365);
        stats.setDailyStats(getDailyStats(days));
        
        return stats;
    }

    /**
     * Lấy thống kê theo phòng ban
     */
    public List<DepartmentStatsDto> getDepartmentStats(String period) {
        List<Department> departments = departmentRepository.findByIsActive(true);
        List<DepartmentStatsDto> departmentStats = new ArrayList<>();
        
        for (Department dept : departments) {
            DepartmentStatsDto deptStat = new DepartmentStatsDto();
            deptStat.setDepartmentId(dept.getId());
            deptStat.setDepartmentName(dept.getName());
            
            // Thống kê ticket của phòng ban với status thực tế
            Map<String, Long> deptTicketCounts = getTicketCountsByDepartment(dept.getId());
            deptStat.setTotalTickets(deptTicketCounts.values().stream().mapToLong(Long::longValue).sum());
            deptStat.setPendingTickets(deptTicketCounts.getOrDefault("PENDING", 0L));
            deptStat.setApprovedTickets(deptTicketCounts.getOrDefault("COMPLETED", 0L)); // COMPLETED thay vì APPROVED
            deptStat.setRejectedTickets(deptTicketCounts.getOrDefault("REJECTED", 0L));
            deptStat.setInProgressTickets(deptTicketCounts.getOrDefault("IN_PROGRESS", 0L));
            
            // Thống kê người dùng
            deptStat.setTotalUsers((long) userRepository.findByDepartmentId(dept.getId()).size());
            deptStat.setActiveUsers(userRepository.countByDepartmentIdAndIsActive(dept.getId(), true));
            
            // Tính tỷ lệ hoàn thành (completion rate) cho phòng ban
            if (deptStat.getTotalTickets() > 0) {
                deptStat.setApprovalRate((double) deptStat.getApprovedTickets() / deptStat.getTotalTickets() * 100);
            } else {
                deptStat.setApprovalRate(0.0);
            }
            
            // Thời gian xử lý trung bình (giả lập - có thể implement sau)
            deptStat.setAverageProcessingTime(calculateAverageProcessingTime(dept.getId()));
            
            departmentStats.add(deptStat);
        }
        
        // Sắp xếp theo hiệu suất và gán rank
        departmentStats.sort((a, b) -> Double.compare(b.getApprovalRate(), a.getApprovalRate()));
        for (int i = 0; i < departmentStats.size(); i++) {
            departmentStats.get(i).setPerformanceRank(i + 1);
        }
        
        return departmentStats;
    }

    /**
     * Lấy thống kê ticket theo ngày (cho biểu đồ)
     */
    public List<DailyTicketStatsDto> getDailyStats(int days) {
        List<DailyTicketStatsDto> dailyStats = new ArrayList<>();
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);
        
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            DailyTicketStatsDto dayStat = new DailyTicketStatsDto();
            dayStat.setDate(date);
            dayStat.setDateString(date.format(DateTimeFormatter.ISO_LOCAL_DATE));
            dayStat.setDayOfWeek(date.getDayOfWeek().name());
            
            // Đếm ticket được tạo trong ngày
            LocalDateTime dayStart = date.atStartOfDay();
            LocalDateTime dayEnd = date.plusDays(1).atStartOfDay();
            
            dayStat.setCreatedTickets(ticketRepository.countByCreatedAtBetween(dayStart, dayEnd));
            
            // Tạm thời sử dụng 0 cho completed/rejected daily vì cần thêm updatedAt tracking
            // TODO: Thêm method countByCurrentStatusNameAndUpdatedAtBetween vào repository
            dayStat.setApprovedTickets(0L); // Tickets completed trong ngày
            dayStat.setRejectedTickets(0L); // Tickets rejected/cancelled trong ngày
            
            // Đếm ticket đang pending tại thời điểm cuối ngày
            dayStat.setPendingTickets(ticketRepository.countByCurrentStatusNameAndCreatedAtLessThanEqual("PENDING", dayEnd));
            
            // Tổng ticket hoạt động = tickets tạo mới trong ngày
            dayStat.setTotalActiveTickets(dayStat.getCreatedTickets());
            
            dailyStats.add(dayStat);
        }
        
        return dailyStats;
    }

    // ========== HELPER METHODS ==========
    
    /**
     * Lấy số lượng ticket theo trạng thái (tối ưu với single query)
     */
    private Map<String, Long> getTicketStatusCounts() {
        // Sử dụng group by để tối ưu performance
        List<Object[]> results = ticketRepository.findTicketCountGroupByStatusRaw();
        return results.stream()
                .collect(Collectors.toMap(
                    result -> (String) result[0],
                    result -> (Long) result[1]
                ));
    }
    
    /**
     * Lấy số lượng ticket theo phòng ban và trạng thái
     */
    private Map<String, Long> getTicketCountsByDepartment(Long departmentId) {
        List<Object[]> results = ticketRepository.findTicketCountByDepartmentGroupByStatusRaw(departmentId);
        return results.stream()
                .collect(Collectors.toMap(
                    result -> (String) result[0],
                    result -> (Long) result[1]
                ));
    }
    
    /**
     * Tính thời gian xử lý trung bình của phòng ban (giờ)
     */
    private Double calculateAverageProcessingTime(Long departmentId) {
        // TODO: Implement logic tính toán dựa vào bảng ticket_approvals
        // Tạm thời return giá trị mặc định
        return 24.0; // 24 giờ
    }
}
