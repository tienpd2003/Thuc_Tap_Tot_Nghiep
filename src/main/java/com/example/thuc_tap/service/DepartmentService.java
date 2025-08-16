package com.example.thuc_tap.service;

import com.example.thuc_tap.dto.DepartmentDto;
import com.example.thuc_tap.dto.UserDto;
import com.example.thuc_tap.entity.Department;
import com.example.thuc_tap.entity.User;
import com.example.thuc_tap.repository.DepartmentRepository;
import com.example.thuc_tap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<DepartmentDto> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return departments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<DepartmentDto> getActiveDepartments() {
        List<Department> departments = departmentRepository.findByIsActive(true);
        return departments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<DepartmentDto> getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .map(this::convertToDtoWithUsers);
    }

    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        // Check if department with same name already exists
        if (departmentRepository.existsByName(departmentDto.getName())) {
            throw new RuntimeException("Department with name '" + departmentDto.getName() + "' already exists");
        }

        Department department = convertToEntity(departmentDto);
        Department savedDepartment = departmentRepository.save(department);
        return convertToDto(savedDepartment);
    }

    public Optional<DepartmentDto> updateDepartment(Long id, DepartmentDto departmentDto) {
        return departmentRepository.findById(id)
                .map(existingDepartment -> {
                    // Check if new name conflicts with existing departments (excluding current one)
                    if (!existingDepartment.getName().equals(departmentDto.getName()) &&
                        departmentRepository.existsByName(departmentDto.getName())) {
                        throw new RuntimeException("Department with name '" + departmentDto.getName() + "' already exists");
                    }

                    existingDepartment.setName(departmentDto.getName());
                    existingDepartment.setDescription(departmentDto.getDescription());
                    existingDepartment.setIsActive(departmentDto.getIsActive());

                    Department updatedDepartment = departmentRepository.save(existingDepartment);
                    return convertToDto(updatedDepartment);
                });
    }

    public boolean deleteDepartment(Long id) {
        return departmentRepository.findById(id)
                .map(department -> {
                    // Check if there are users in this department
                    List<User> usersInDepartment = userRepository.findByDepartmentId(id);
                    if (!usersInDepartment.isEmpty()) {
                        throw new RuntimeException("Cannot delete department with existing users. Please reassign users first.");
                    }

                    departmentRepository.delete(department);
                    return true;
                })
                .orElse(false);
    }

    public boolean deactivateDepartment(Long id) {
        return departmentRepository.findById(id)
                .map(department -> {
                    department.setIsActive(false);
                    departmentRepository.save(department);
                    return true;
                })
                .orElse(false);
    }

    public List<UserDto> getUsersByDepartment(Long departmentId) {
        List<User> users = userRepository.findByDepartmentId(departmentId);
        return users.stream()
                .map(this::convertUserToDto)
                .collect(Collectors.toList());
    }

    private DepartmentDto convertToDto(Department department) {
        DepartmentDto dto = new DepartmentDto();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setDescription(department.getDescription());
        dto.setIsActive(department.getIsActive());
        dto.setCreatedAt(department.getCreatedAt());
        dto.setUpdatedAt(department.getUpdatedAt());

        // Count users in this department
        long userCount = userRepository.findByDepartmentId(department.getId()).size();
        dto.setUserCount(userCount);

        return dto;
    }

    private DepartmentDto convertToDtoWithUsers(Department department) {
        DepartmentDto dto = convertToDto(department);

        // Add users list for detailed view
        List<User> users = userRepository.findByDepartmentId(department.getId());
        List<UserDto> userDtos = users.stream()
                .map(this::convertUserToDto)
                .collect(Collectors.toList());
        dto.setUsers(userDtos);

        return dto;
    }

    private Department convertToEntity(DepartmentDto departmentDto) {
        Department department = new Department();
        department.setName(departmentDto.getName());
        department.setDescription(departmentDto.getDescription());
        department.setIsActive(departmentDto.getIsActive() != null ? departmentDto.getIsActive() : true);
        return department;
    }

    private UserDto convertUserToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmployeeCode(user.getEmployeeCode());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setIsActive(user.getIsActive());

        if (user.getDepartment() != null) {
            dto.setDepartmentId(user.getDepartment().getId());
            dto.setDepartmentName(user.getDepartment().getName());
        }

        if (user.getRole() != null) {
            dto.setRoleId(user.getRole().getId());
            dto.setRoleName(user.getRole().getName());
        }

        return dto;
    }
}
