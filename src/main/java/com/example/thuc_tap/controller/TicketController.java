package com.example.thuc_tap.controller;

import com.example.thuc_tap.dto.TicketDto;
import com.example.thuc_tap.dto.TicketFormDataDto;
import com.example.thuc_tap.service.TicketService;
import com.example.thuc_tap.service.TicketFormDataService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller xử lý CRUD ticket
 */
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private TicketFormDataService ticketFormDataService;

    /**
     * Tạo ticket mới
     */
    @PostMapping
    public ResponseEntity<TicketDto> createTicket(@Valid @RequestBody TicketDto ticketDto) {
        TicketDto createdTicket = ticketService.createTicket(ticketDto);
        return ResponseEntity.ok(createdTicket);
    }

    /**
     * Lấy chi tiết ticket
     */
    @GetMapping("/{ticketId}")
    public ResponseEntity<TicketDto> getTicketById(@PathVariable Long ticketId) {
        Optional<TicketDto> ticket = ticketService.getTicketById(ticketId);
        return ticket.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Cập nhật ticket (chỉ cho phép cập nhật ticket PENDING của chính mình)
     */
    @PutMapping("/{ticketId}/employee/{employeeId}")
    public ResponseEntity<TicketDto> updateTicket(
            @PathVariable Long ticketId,
            @PathVariable Long employeeId,
            @Valid @RequestBody TicketDto ticketDto) {
        
        Optional<TicketDto> updatedTicket = ticketService.updateTicket(ticketId, employeeId, ticketDto);
        return updatedTicket.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Xóa ticket (chỉ cho phép xóa ticket PENDING của chính mình)
     */
    @DeleteMapping("/{ticketId}/employee/{employeeId}")
    public ResponseEntity<Void> deleteTicket(
            @PathVariable Long ticketId,
            @PathVariable Long employeeId) {
        
        boolean deleted = ticketService.deleteTicket(ticketId, employeeId);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    /**
     * Lấy dữ liệu form của ticket
     */
    @GetMapping("/{ticketId}/form-data")
    public ResponseEntity<List<TicketFormDataDto>> getTicketFormData(@PathVariable Long ticketId) {
        List<TicketFormDataDto> formData = ticketFormDataService.getTicketFormData(ticketId);
        return ResponseEntity.ok(formData);
    }

    /**
     * Lưu dữ liệu form của ticket
     */
    @PostMapping("/{ticketId}/form-data")
    public ResponseEntity<List<TicketFormDataDto>> saveTicketFormData(
            @PathVariable Long ticketId,
            @RequestBody List<TicketFormDataDto> formDataList) {
        
        List<TicketFormDataDto> savedFormData = ticketFormDataService.saveTicketFormData(ticketId, formDataList);
        return ResponseEntity.ok(savedFormData);
    }

    /**
     * Cập nhật dữ liệu form của ticket
     */
    @PutMapping("/{ticketId}/form-data")
    public ResponseEntity<List<TicketFormDataDto>> updateTicketFormData(
            @PathVariable Long ticketId,
            @RequestBody List<TicketFormDataDto> formDataList) {
        
        List<TicketFormDataDto> updatedFormData = ticketFormDataService.updateTicketFormData(ticketId, formDataList);
        return ResponseEntity.ok(updatedFormData);
    }
}
