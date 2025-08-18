package com.example.thuc_tap.service;

import com.example.thuc_tap.dto.DepartmentDto;
import com.example.thuc_tap.dto.UserDto;
import com.example.thuc_tap.entity.Department;
import com.example.thuc_tap.entity.User;
import com.example.thuc_tap.mapper.DepartmentMapper;
import com.example.thuc_tap.mapper.UserMapper;
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

    @Autowired
    private DepartmentMapper departmentMapper; // Loại bỏ method convertToDto trùng lặp - sử dụng Mapper thay thế

    @Autowired
    private UserMapper userMapper; // Loại bỏ method convertToDto trùng lặp - sử dụng Mapper thay thế

    public List<DepartmentDto> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return departments.stream()
                .map(department -> {
                    DepartmentDto dto = departmentMapper.toDto(department);
                    // Thêm user count để hiển thị thống kê
                    long userCount = userRepository.findByDepartmentId(department.getId()).size();
                    dto.setUserCount(userCount);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<DepartmentDto> getActiveDepartments() {
        List<Department> departments = departmentRepository.findByIsActive(true);
        return departments.stream()
                .map(department -> {
                    DepartmentDto dto = departmentMapper.toDto(department);
                    // Thêm user count để hiển thị thống kê
                    long userCount = userRepository.findByDepartmentId(department.getId()).size();
                    dto.setUserCount(userCount);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public Optional<DepartmentDto> getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .map(department -> {
                    DepartmentDto dto = departmentMapper.toDto(department);
                    // Thêm user count và danh sách users cho detailed view
                    List<User> users = userRepository.findByDepartmentId(department.getId());
                    dto.setUserCount((long) users.size());
                    List<UserDto> userDtos = users.stream()
                            .map(userMapper::toDto)
                            .collect(Collectors.toList());
                    dto.setUsers(userDtos);
                    return dto;
                });
    }

    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        // Check if department with same name already exists
        if (departmentRepository.existsByName(departmentDto.getName())) {
            throw new RuntimeException("Department with name '" + departmentDto.getName() + "' already exists");
        }

        Department department = departmentMapper.toEntity(departmentDto);
        Department savedDepartment = departmentRepository.save(department);
        DepartmentDto dto = departmentMapper.toDto(savedDepartment);
        // Thêm user count (sẽ là 0 cho department mới)
        dto.setUserCount(0L);
        return dto;
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
                    DepartmentDto dto = departmentMapper.toDto(updatedDepartment);
                    // Thêm user count để hiển thị thống kê
                    long userCount = userRepository.findByDepartmentId(updatedDepartment.getId()).size();
                    dto.setUserCount(userCount);
                    return dto;
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
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

}
