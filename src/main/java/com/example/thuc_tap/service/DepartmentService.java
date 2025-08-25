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
                    
                    // Thêm thông tin department head
                    if (department.getDepartmentHeadId() != null) {
                        userRepository.findById(department.getDepartmentHeadId())
                                .ifPresent(head -> {
                                    dto.setDepartmentHeadId(head.getId());
                                    dto.setDepartmentHeadName(head.getFullName());
                                    dto.setDepartmentHeadEmail(head.getEmail());
                                    dto.setDepartmentHeadEmployeeCode(head.getEmployeeCode());
                                });
                    }
                    
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
                    
                    // Thêm thông tin department head
                    if (department.getDepartmentHeadId() != null) {
                        userRepository.findById(department.getDepartmentHeadId())
                                .ifPresent(head -> {
                                    dto.setDepartmentHeadId(head.getId());
                                    dto.setDepartmentHeadName(head.getFullName());
                                    dto.setDepartmentHeadEmail(head.getEmail());
                                    dto.setDepartmentHeadEmployeeCode(head.getEmployeeCode());
                                });
                    }
                    
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
                    
                    // Thêm thông tin department head
                    if (department.getDepartmentHeadId() != null) {
                        userRepository.findById(department.getDepartmentHeadId())
                                .ifPresent(head -> {
                                    dto.setDepartmentHeadId(head.getId());
                                    dto.setDepartmentHeadName(head.getFullName());
                                    dto.setDepartmentHeadEmail(head.getEmail());
                                    dto.setDepartmentHeadEmployeeCode(head.getEmployeeCode());
                                });
                    }
                    
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
                    
                    // Update department head
                    if (departmentDto.getDepartmentHeadId() != null) {
                        // Validate that the user exists and has APPROVER role
                        Optional<User> headUser = userRepository.findById(departmentDto.getDepartmentHeadId());
                        if (headUser.isEmpty()) {
                            throw new RuntimeException("Selected department head user not found");
                        }
                        
                        // Check if user has APPROVER role
                        if (headUser.get().getRole() == null || 
                            !"APPROVER".equals(headUser.get().getRole().getName())) {
                            throw new RuntimeException("Only users with APPROVER role can be assigned as department heads");
                        }
                        
                        existingDepartment.setDepartmentHeadId(departmentDto.getDepartmentHeadId());
                    } else {
                        existingDepartment.setDepartmentHeadId(null);
                    }

                    Department updatedDepartment = departmentRepository.save(existingDepartment);
                    DepartmentDto dto = departmentMapper.toDto(updatedDepartment);
                    // Thêm user count để hiển thị thống kê
                    long userCount = userRepository.findByDepartmentId(updatedDepartment.getId()).size();
                    dto.setUserCount(userCount);
                    
                    // Thêm thông tin department head
                    if (updatedDepartment.getDepartmentHeadId() != null) {
                        userRepository.findById(updatedDepartment.getDepartmentHeadId())
                                .ifPresent(head -> {
                                    dto.setDepartmentHeadId(head.getId());
                                    dto.setDepartmentHeadName(head.getFullName());
                                    dto.setDepartmentHeadEmail(head.getEmail());
                                    dto.setDepartmentHeadEmployeeCode(head.getEmployeeCode());
                                });
                    }
                    
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

    public Optional<DepartmentDto> updateDepartmentHead(Long departmentId, Long headUserId) {
        return departmentRepository.findById(departmentId)
                .map(department -> {
                    if (headUserId != null) {
                        // Validate that the user exists
                        Optional<User> headUser = userRepository.findById(headUserId);
                        if (headUser.isEmpty()) {
                            throw new RuntimeException("Selected user not found");
                        }
                        
                        // Check if user has APPROVER role
                        if (headUser.get().getRole() == null || 
                            !"APPROVER".equals(headUser.get().getRole().getName())) {
                            throw new RuntimeException("Only users with APPROVER role can be assigned as department heads");
                        }
                        
                        department.setDepartmentHeadId(headUserId);
                    } else {
                        department.setDepartmentHeadId(null);
                    }

                    Department updatedDepartment = departmentRepository.save(department);
                    DepartmentDto dto = departmentMapper.toDto(updatedDepartment);
                    
                    // Add user count
                    long userCount = userRepository.findByDepartmentId(updatedDepartment.getId()).size();
                    dto.setUserCount(userCount);
                    
                    // Add department head info
                    if (updatedDepartment.getDepartmentHeadId() != null) {
                        userRepository.findById(updatedDepartment.getDepartmentHeadId())
                                .ifPresent(head -> {
                                    dto.setDepartmentHeadId(head.getId());
                                    dto.setDepartmentHeadName(head.getFullName());
                                    dto.setDepartmentHeadEmail(head.getEmail());
                                    dto.setDepartmentHeadEmployeeCode(head.getEmployeeCode());
                                });
                    }
                    
                    return dto;
                });
    }

}
