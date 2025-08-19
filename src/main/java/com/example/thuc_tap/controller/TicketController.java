package com.example.thuc_tap.controller;

import com.example.thuc_tap.dto.TicketDto;
import com.example.thuc_tap.dto.TicketFormDataDto;
import com.example.thuc_tap.service.TicketService;
import com.example.thuc_tap.service.TicketFormDataService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Ticket Management", description = "APIs for managing tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private TicketFormDataService ticketFormDataService;

    /**
     * Tạo ticket mới
     */
    @Operation(
        summary = "Tạo ticket mới",
        description = "Tạo một ticket mới với form template và approval workflow",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Thông tin ticket cần tạo",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = TicketDto.class),
                examples = {
                    @ExampleObject(
                        name = "Leave Request Example",
                        summary = "Ví dụ đơn xin nghỉ phép",
                        description = "Một ví dụ hoàn chỉnh về đơn xin nghỉ phép với form data",
                        value = """
                            {
                              "title": "Yêu cầu nghỉ phép",
                              "description": "Tôi muốn xin nghỉ phép từ ngày 15/01 đến 20/01 để du lịch với gia đình",
                              "requesterId": 1,
                              "departmentId": 1,
                              "formTemplateId": 2,
                              "priorityId": 2,
                              "dueDate": "2024-01-10T17:00:00",
                              "formData": [
                                {
                                  "fieldId": 1,
                                  "fieldName": "start_date",
                                  "fieldLabel": "Ngày bắt đầu",
                                  "fieldValue": "2024-01-15",
                                  "fieldType": "DATE"
                                },
                                {
                                  "fieldId": 2,
                                  "fieldName": "end_date", 
                                  "fieldLabel": "Ngày kết thúc",
                                  "fieldValue": "2024-01-20",
                                  "fieldType": "DATE"
                                },
                                {
                                  "fieldId": 3,
                                  "fieldName": "reason",
                                  "fieldLabel": "Lý do nghỉ phép",
                                  "fieldValue": "Du lịch với gia đình",
                                  "fieldType": "TEXTAREA"
                                }
                              ]
                            }
                            """
                    ),
                    @ExampleObject(
                        name = "Equipment Request Example",
                        summary = "Ví dụ đơn xin thiết bị",
                        description = "Ví dụ về đơn xin cấp thiết bị văn phòng",
                        value = """
                            {
                              "title": "Yêu cầu cấp laptop mới",
                              "description": "Cần laptop mới để làm việc",
                              "requesterId": 1,
                              "departmentId": 7,
                              "formTemplateId": 3,
                              "priorityId": 1,
                              "dueDate": "2024-01-15T17:00:00",
                              "formData": [
                                {
                                  "fieldId": 4,
                                  "fieldName": "equipment_type",
                                  "fieldLabel": "Loại thiết bị",
                                  "fieldValue": "laptop",
                                  "fieldType": "SELECT"
                                },
                                {
                                  "fieldId": 5,
                                  "fieldName": "specifications",
                                  "fieldLabel": "Thông số kỹ thuật",
                                  "fieldValue": "Core i7, 16GB RAM, 512GB SSD",
                                  "fieldType": "TEXTAREA"
                                }
                              ]
                            }
                            """
                    )
                }
            )
        )
    )
    
    
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
