package com.example.thuc_tap.controller;

import com.example.thuc_tap.dto.TicketDto;
import com.example.thuc_tap.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Controller xử lý các chức năng dành cho nhân viên
 */
@RestController
@RequestMapping("/api/employee")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private TicketService ticketService;

    /**
     * Dashboard - Lấy thống kê ticket của nhân viên
     */
    @GetMapping("/{employeeId}/dashboard")
    public ResponseEntity<TicketService.EmployeeTicketStats> getDashboard(@PathVariable Long employeeId) {
        TicketService.EmployeeTicketStats stats = ticketService.getEmployeeTicketStats(employeeId);
        return ResponseEntity.ok(stats);
    }

    /**
     * Lịch sử ticket - Lấy danh sách ticket với phân trang và sắp xếp
     */
    @GetMapping("/{employeeId}/tickets")
    public ResponseEntity<Page<TicketDto>> getEmployeeTickets(
            @PathVariable Long employeeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<TicketDto> tickets = ticketService.getEmployeeTickets(employeeId, pageable);
        
        return ResponseEntity.ok(tickets);
    }

    /**
     * Lọc ticket theo trạng thái
     */
    @GetMapping("/{employeeId}/tickets/status/{statusName}")
    public ResponseEntity<List<TicketDto>> getTicketsByStatus(
            @PathVariable Long employeeId,
            @PathVariable String statusName) {
        
        List<TicketDto> tickets = ticketService.getEmployeeTicketsByStatus(employeeId, statusName);
        return ResponseEntity.ok(tickets);
    }

    /**
     * Tìm kiếm ticket theo từ khóa
     */
    @GetMapping("/{employeeId}/tickets/search")
    public ResponseEntity<List<TicketDto>> searchTickets(
            @PathVariable Long employeeId,
            @RequestParam String keyword) {
        
        List<TicketDto> tickets = ticketService.searchEmployeeTickets(employeeId, keyword);
        return ResponseEntity.ok(tickets);
    }

    /**
     * Lọc ticket theo khoảng thời gian
     */
    @GetMapping("/{employeeId}/tickets/dateRange")
    public ResponseEntity<List<TicketDto>> getTicketsByDateRange(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        List<TicketDto> tickets = ticketService.getEmployeeTicketsByDateRange(employeeId, startDate, endDate);
        return ResponseEntity.ok(tickets);
    }
}
