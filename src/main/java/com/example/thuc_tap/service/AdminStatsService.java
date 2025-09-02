package com.example.thuc_tap.service;

import com.example.thuc_tap.dto.response.AdminDashboardStatsDto;
import com.example.thuc_tap.dto.response.DailyTicketStatsDto;
import com.example.thuc_tap.dto.response.DepartmentStatsDto;
import com.example.thuc_tap.dto.response.UserGrowthStatsDto;
import com.example.thuc_tap.dto.response.RecentUserDto;
import com.example.thuc_tap.entity.Department;
import com.example.thuc_tap.entity.User;
import com.example.thuc_tap.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
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

    /**
     * Lấy thống kê tăng trưởng người dùng theo thời gian
     * @param period "week", "month", "year" - thời kỳ thống kê
     * @return List<UserGrowthStatsDto> dữ liệu cho biểu đồ tăng trưởng người dùng
     */
    public List<UserGrowthStatsDto> getUserGrowthStats(String period) {
        List<UserGrowthStatsDto> growthStats = new ArrayList<>();
        
        // Xác định khoảng thời gian và bước nhảy
        LocalDate endDate = LocalDate.now();
        LocalDate startDate;
        
        switch (period.toLowerCase()) {
            case "week":
                startDate = endDate.minusWeeks(12); // 12 tuần trước
                break;
            case "year":
                startDate = endDate.minusYears(2); // 2 năm trước
                break;
            default: // month
                startDate = endDate.minusMonths(12); // 12 tháng trước
                break;
        }
        
        // Lấy dữ liệu theo từng khoảng thời gian
        if (period.equals("week")) {
            growthStats = getUserGrowthByWeeks(startDate, endDate);
        } else if (period.equals("year")) {
            growthStats = getUserGrowthByYears(startDate, endDate);
        } else {
            growthStats = getUserGrowthByMonths(startDate, endDate);
        }
        
        return growthStats;
    }
    
    /**
     * Lấy thống kê tăng trưởng người dùng theo tháng
     */
    private List<UserGrowthStatsDto> getUserGrowthByMonths(LocalDate startDate, LocalDate endDate) {
        List<UserGrowthStatsDto> monthlyStats = new ArrayList<>();
        
        LocalDate currentMonth = startDate.withDayOfMonth(1);
        while (!currentMonth.isAfter(endDate)) {
            LocalDate nextMonth = currentMonth.plusMonths(1);
            LocalDateTime monthStart = currentMonth.atStartOfDay();
            LocalDateTime monthEnd = nextMonth.atStartOfDay();
            
            UserGrowthStatsDto monthStat = UserGrowthStatsDto.builder()
                    .date(currentMonth)
                    .month("Tháng " + currentMonth.getMonthValue())
                    .dateString(currentMonth.format(DateTimeFormatter.ISO_LOCAL_DATE))
                    .build();
            
            // Đếm người dùng mới trong tháng
            Long newUsersInMonth = userRepository.countByCreatedAtBetween(monthStart, monthEnd);
            monthStat.setNewUsers(newUsersInMonth);
            
            // Tổng số người dùng tích lũy đến cuối tháng
            Long totalUsersUntilMonth = userRepository.countByCreatedAtLessThan(monthEnd);
            monthStat.setTotalUsers(totalUsersUntilMonth);
            
            // Người dùng hoạt động trong tháng (có đăng nhập hoặc tạo ticket)
            // TODO: Cần thêm tracking lastLoginAt hoặc tính dựa trên ticket activity
            Long activeUsersInMonth = Math.round(totalUsersUntilMonth * 0.7); // Giả định 70% active
            monthStat.setActiveUsers(activeUsersInMonth);
            
            // Tính tỷ lệ tăng trưởng so với tháng trước
            if (!monthlyStats.isEmpty()) {
                UserGrowthStatsDto previousMonth = monthlyStats.get(monthlyStats.size() - 1);
                if (previousMonth.getTotalUsers() > 0) {
                    double growth = ((double) (totalUsersUntilMonth - previousMonth.getTotalUsers()) 
                                   / previousMonth.getTotalUsers()) * 100;
                    monthStat.setGrowthRate(Math.round(growth * 10.0) / 10.0); // Round to 1 decimal
                }
            }
            
            monthlyStats.add(monthStat);
            currentMonth = nextMonth;
        }
        
        return monthlyStats;
    }
    
    /**
     * Lấy thống kê tăng trưởng người dùng theo tuần
     */
    private List<UserGrowthStatsDto> getUserGrowthByWeeks(LocalDate startDate, LocalDate endDate) {
        List<UserGrowthStatsDto> weeklyStats = new ArrayList<>();
        
        LocalDate currentWeek = startDate;
        int weekNumber = 1;
        
        while (!currentWeek.isAfter(endDate)) {
            LocalDate nextWeek = currentWeek.plusWeeks(1);
            LocalDateTime weekStart = currentWeek.atStartOfDay();
            LocalDateTime weekEnd = nextWeek.atStartOfDay();
            
            UserGrowthStatsDto weekStat = UserGrowthStatsDto.builder()
                    .date(currentWeek)
                    .month("Tuần " + weekNumber)
                    .dateString(currentWeek.format(DateTimeFormatter.ISO_LOCAL_DATE))
                    .build();
            
            // Đếm người dùng mới trong tuần
            Long newUsersInWeek = userRepository.countByCreatedAtBetween(weekStart, weekEnd);
            weekStat.setNewUsers(newUsersInWeek);
            
            // Tổng số người dùng tích lũy đến cuối tuần
            Long totalUsersUntilWeek = userRepository.countByCreatedAtLessThan(weekEnd);
            weekStat.setTotalUsers(totalUsersUntilWeek);
            
            // Người dùng hoạt động ước tính
            Long activeUsersInWeek = Math.round(totalUsersUntilWeek * 0.8); // Giả định 80% active
            weekStat.setActiveUsers(activeUsersInWeek);
            
            weeklyStats.add(weekStat);
            currentWeek = nextWeek;
            weekNumber++;
        }
        
        return weeklyStats;
    }
    
    /**
     * Lấy thống kê tăng trưởng người dùng theo năm
     */
    private List<UserGrowthStatsDto> getUserGrowthByYears(LocalDate startDate, LocalDate endDate) {
        List<UserGrowthStatsDto> yearlyStats = new ArrayList<>();
        
        int startYear = startDate.getYear();
        int endYear = endDate.getYear();
        
        for (int year = startYear; year <= endYear; year++) {
            LocalDate yearStart = LocalDate.of(year, 1, 1);
            LocalDate yearEnd = LocalDate.of(year + 1, 1, 1);
            LocalDateTime yearStartTime = yearStart.atStartOfDay();
            LocalDateTime yearEndTime = yearEnd.atStartOfDay();
            
            UserGrowthStatsDto yearStat = UserGrowthStatsDto.builder()
                    .date(yearStart)
                    .month("Năm " + year)
                    .dateString(yearStart.format(DateTimeFormatter.ISO_LOCAL_DATE))
                    .build();
            
            // Đếm người dùng mới trong năm
            Long newUsersInYear = userRepository.countByCreatedAtBetween(yearStartTime, yearEndTime);
            yearStat.setNewUsers(newUsersInYear);
            
            // Tổng số người dùng tích lũy đến cuối năm
            Long totalUsersUntilYear = userRepository.countByCreatedAtLessThan(yearEndTime);
            yearStat.setTotalUsers(totalUsersUntilYear);
            
            // Người dùng hoạt động ước tính
            Long activeUsersInYear = Math.round(totalUsersUntilYear * 0.6); // Giả định 60% active
            yearStat.setActiveUsers(activeUsersInYear);
            
            yearlyStats.add(yearStat);
        }
        
        return yearlyStats;
    }
    
    /**
     * Lấy danh sách người dùng mới đăng ký gần đây
     * @param limit số lượng người dùng cần lấy (default: 10)
     * @return List<RecentUserDto> danh sách người dùng mới
     */
    public List<RecentUserDto> getRecentUsers(int limit) {
        if (limit <= 0 || limit > 50) {
            limit = 10; // Default value và giới hạn tối đa
        }
        
        // Lấy người dùng mới nhất theo thời gian tạo, sắp xếp giảm dần
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<User> recentUsers = userRepository.findByIsActiveWithPagination(true, pageable);
        
        return recentUsers.stream()
                .map(this::convertToRecentUserDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Chuyển đổi User entity thành RecentUserDto
     */
    private RecentUserDto convertToRecentUserDto(User user) {
        RecentUserDto dto = RecentUserDto.builder()
                .id(user.getId())
                .employeeCode(user.getEmployeeCode())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
        
        // Thông tin phòng ban
        if (user.getDepartment() != null) {
            dto.setDepartmentName(user.getDepartment().getName());
        } else {
            dto.setDepartmentName("Chưa phân công");
        }
        
        // Thông tin vai trò
        if (user.getRole() != null) {
            dto.setRoleName(user.getRole().getName());
            dto.setRoleLabel(convertRoleToLabel(user.getRole().getName()));
        }
        
        // Tính thời gian "time ago"
        dto.setTimeAgo(calculateTimeAgo(user.getCreatedAt()));
        
        // Xác định trạng thái
        dto.setStatusLabel(user.getIsActive() ? "Hoạt động" : "Vô hiệu hóa");
        
        // Đếm số ticket đã tạo
        Long ticketCount = ticketRepository.countByRequesterId(user.getId());
        dto.setTotalTicketsCreated(ticketCount);
        
        // TODO: Implement lastLoginAt và lastActivityAt tracking
        dto.setLastLoginAt(user.getCreatedAt()); // Tạm thời dùng createdAt
        dto.setLastActivityAt(user.getUpdatedAt() != null ? user.getUpdatedAt() : user.getCreatedAt());
        
        return dto;
    }
    
    /**
     * Chuyển đổi tên role thành label tiếng Việt
     */
    private String convertRoleToLabel(String roleName) {
        if (roleName == null) return "Không xác định";
        
        switch (roleName.toUpperCase()) {
            case "ADMIN":
                return "Quản trị viên";
            case "APPROVER":
                return "Người phê duyệt";
            case "EMPLOYEE":
                return "Nhân viên";
            default:
                return roleName;
        }
    }
    
    /**
     * Tính thời gian "time ago" từ thời điểm tạo đến hiện tại
     */
    private String calculateTimeAgo(LocalDateTime createdAt) {
        if (createdAt == null) return "Không xác định";
        
        LocalDateTime now = LocalDateTime.now();
        long minutes = ChronoUnit.MINUTES.between(createdAt, now);
        long hours = ChronoUnit.HOURS.between(createdAt, now);
        long days = ChronoUnit.DAYS.between(createdAt, now);
        
        if (minutes < 60) {
            return minutes <= 1 ? "1 phút trước" : minutes + " phút trước";
        } else if (hours < 24) {
            return hours == 1 ? "1 giờ trước" : hours + " giờ trước";
        } else if (days < 30) {
            return days == 1 ? "1 ngày trước" : days + " ngày trước";
        } else {
            long months = days / 30;
            return months == 1 ? "1 tháng trước" : months + " tháng trước";
        }
    }
}
