package com.example.thuc_tap.controller;

import com.example.thuc_tap.dto.TicketDto;
import com.example.thuc_tap.dto.request.CreateTicketFromTemplateRequest;
import com.example.thuc_tap.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Controller xử lý CRUD ticket
 */
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
@Tag(name = "Ticket Management", description = "APIs for managing tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    // Deprecated: form-data APIs removed since ticket stores JSON form_data directly

    // Removed legacy createTicket(TicketDto) since we now create from template JSON map

    /**
     * Tạo ticket từ form template với form data và workflow approvers
     */
    @Operation(
        summary = "Tạo ticket từ form template",
        description = "Tạo ticket dựa trên form template. Dữ liệu form gửi theo dạng JSON map: {\"fieldKey\": value}.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Thông tin tạo ticket từ template",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = CreateTicketFromTemplateRequest.class),
                examples = {
                    @ExampleObject(
                        name = "Leave Request (Map-based formData)",
                        summary = "Đơn xin nghỉ phép",
                        value = """
                        {
                          "templateId": 1,
                          "requesterId": 5,
                          "title": "Xin nghỉ phép 5 ngày",
                          "description": "Lý do cá nhân",
                          "formData": {
                            "reason": "Việc gia đình",
                            "fromDate": "2025-09-01",
                            "toDate": "2025-09-05"
                          },
                          "workflowApprovers": {
                            "10": "any",
                            "11": "23"
                          }
                        }
                        """
                    ),
                    @ExampleObject(
                        name = "Equipment Request (Map-based formData)",
                        summary = "Yêu cầu cấp thiết bị",
                        value = """
                        {
                          "templateId": 3,
                          "requesterId": 5,
                          "title": "Cấp laptop mới",
                          "formData": {
                            "equipment_type": "laptop",
                            "specifications": "Core i7, 16GB RAM, 512GB SSD"
                          },
                          "workflowApprovers": {
                            "21": "any",
                            "22": "any"
                          }
                        }
                        """
                    )
                }
            )
        )
    )
    @PostMapping("/from-template")
    public ResponseEntity<TicketDto> createTicketFromTemplate(@Valid @RequestBody CreateTicketFromTemplateRequest request) {
        TicketDto createdTicket = ticketService.createTicketFromTemplate(request);
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

    

    // Deprecated form-data endpoints removed: ticket now stores form_data JSON directly
}
