package com.example.thuc_tap.mapper;

import com.example.thuc_tap.dto.DepartmentDto;
import com.example.thuc_tap.entity.Department;
import org.springframework.stereotype.Component;

@Component
public class DepartmentMapper {

    public DepartmentDto toDto(Department department) {
        if (department == null) return null;
        
        DepartmentDto dto = new DepartmentDto();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setDescription(department.getDescription());
        dto.setIsActive(department.getIsActive());
        dto.setCreatedAt(department.getCreatedAt());
        dto.setUpdatedAt(department.getUpdatedAt());
        
        return dto;
    }

    public Department toEntity(DepartmentDto dto) {
        if (dto == null) return null;
        
        Department department = new Department();
        department.setId(dto.getId());
        department.setName(dto.getName());
        department.setDescription(dto.getDescription());
        department.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        
        return department;
    }
}
