package com.example.thuc_tap.service;

import com.example.thuc_tap.dto.TicketFormDataDto;
import com.example.thuc_tap.entity.FormField;
import com.example.thuc_tap.entity.Ticket;
import com.example.thuc_tap.entity.TicketFormData;
import com.example.thuc_tap.repository.FormFieldRepository;
import com.example.thuc_tap.repository.TicketFormDataRepository;
import com.example.thuc_tap.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service xử lý dữ liệu form của ticket
 */
@Service
@Transactional
public class TicketFormDataService {

    @Autowired
    private TicketFormDataRepository ticketFormDataRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private FormFieldRepository formFieldRepository;

    /**
     * Lấy dữ liệu form của ticket
     */
    public List<TicketFormDataDto> getTicketFormData(Long ticketId) {
        List<TicketFormData> formDataList = ticketFormDataRepository.findByTicketId(ticketId);
        return formDataList.stream().map(this::convertToDto).toList();
    }

    /**
     * Lưu dữ liệu form mới của ticket
     */
    public List<TicketFormDataDto> saveTicketFormData(Long ticketId, List<TicketFormDataDto> formDataDtoList) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Xóa dữ liệu form cũ nếu có
        ticketFormDataRepository.deleteByTicketId(ticketId);

        // Lưu dữ liệu form mới
        List<TicketFormData> savedFormData = formDataDtoList.stream()
                .map(dto -> {
                    FormField field = formFieldRepository.findById(dto.getFieldId())
                            .orElseThrow(() -> new RuntimeException("Form field not found"));

                    TicketFormData formData = new TicketFormData();
                    formData.setTicket(ticket);
                    formData.setField(field);
                    formData.setFieldValue(dto.getFieldValue());
                    formData.setFilePath(dto.getFilePath());

                    return ticketFormDataRepository.save(formData);
                })
                .toList();

        return savedFormData.stream().map(this::convertToDto).toList();
    }

    /**
     * Cập nhật dữ liệu form của ticket
     */
    public List<TicketFormDataDto> updateTicketFormData(Long ticketId, List<TicketFormDataDto> formDataDtoList) {
        // Sử dụng lại logic save (xóa và tạo mới)
        return saveTicketFormData(ticketId, formDataDtoList);
    }

    /**
     * Convert Entity to DTO
     */
    private TicketFormDataDto convertToDto(TicketFormData formData) {
        TicketFormDataDto dto = new TicketFormDataDto();
        dto.setId(formData.getId());
        dto.setTicketId(formData.getTicket().getId());
        dto.setFieldId(formData.getField().getId());
        dto.setFieldName(formData.getField().getFieldName());
        dto.setFieldLabel(formData.getField().getFieldLabel());
        dto.setFieldValue(formData.getFieldValue());
        dto.setFilePath(formData.getFilePath());
        dto.setFieldType(formData.getField().getFieldType().getName());
        return dto;
    }
}
