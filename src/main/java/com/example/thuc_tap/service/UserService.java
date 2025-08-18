package com.example.thuc_tap.service;

import com.example.thuc_tap.dto.UserDto;
import com.example.thuc_tap.entity.Department;
import com.example.thuc_tap.entity.Role;
import com.example.thuc_tap.entity.User;
import com.example.thuc_tap.mapper.UserMapper;
import com.example.thuc_tap.repository.DepartmentRepository;
import com.example.thuc_tap.repository.RoleRepository;
import com.example.thuc_tap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class để xử lý logic nghiệp vụ cho User
 * Đã được merge và cải tiến với:
 * - Logic đặc biệt cho ADMIN role (không cần phòng ban)
 * - Các chức năng tìm kiếm và vô hiệu hóa người dùng
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserMapper userMapper; // Loại bỏ method convertToDto trùng lặp - sử dụng Mapper thay thế

    /**
     * Lấy danh sách tất cả người dùng
     */
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(userMapper::toDto).toList();
    }

    /**
     * Lấy thông tin người dùng theo ID
     */
    public Optional<UserDto> getUserById(Long id) {
        return userRepository.findById(id).map(userMapper::toDto);
    }

    /**
     * Lấy thông tin người dùng theo username
     */
    public Optional<UserDto> getUserByUsername(String username) {
        return userRepository.findByUsername(username).map(userMapper::toDto);
    }

    /**
     * Tạo người dùng mới
     * Logic đặc biệt: ADMIN role (role_id = 3) không bắt buộc phải có phòng ban
     * Các role khác bắt buộc phải có phòng ban
     */
    public UserDto createUser(UserDto userDto) {
        // Kiểm tra role ID bắt buộc
        if (userDto.getRoleId() == null) {
            throw new RuntimeException("Role ID is required");
        }

        User user = new User();
        user.setEmployeeCode(userDto.getEmployeeCode());
        user.setUsername(userDto.getUsername());
        // Không mã hóa mật khẩu khi bỏ security (chỉ cho môi trường dev)
        user.setPassword(userDto.getPassword());
        user.setFullName(userDto.getFullName());
        user.setEmail(userDto.getEmail());
        user.setPhone(userDto.getPhone());
        user.setIsActive(userDto.getIsActive());

        // Gán role (bắt buộc)
        Role role = roleRepository.findById(userDto.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found with ID: " + userDto.getRoleId()));
        user.setRole(role);

        // Gán phòng ban - ADMIN role (role_id = 3) không cần phòng ban
        if (userDto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(userDto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found with ID: " + userDto.getDepartmentId()));
            user.setDepartment(department);
        } else if (!role.getId().equals(3L)) {
            // Nếu không phải ADMIN role và không có phòng ban, throw error
            throw new RuntimeException("Department is required for non-ADMIN roles");
        }

        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

    /**
     * Cập nhật thông tin người dùng
     * Không cho phép cập nhật employeeCode và username (theo yêu cầu)
     */
    public Optional<UserDto> updateUser(Long id, UserDto userDto) {
        return userRepository.findById(id).map(user -> {
            user.setFullName(userDto.getFullName());
            user.setEmail(userDto.getEmail());
            user.setPhone(userDto.getPhone());
            user.setIsActive(userDto.getIsActive());

            // Cập nhật mật khẩu nếu có
            if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
                user.setPassword(userDto.getPassword());
            }

            // Cập nhật phòng ban nếu có
            if (userDto.getDepartmentId() != null) {
                Department department = departmentRepository.findById(userDto.getDepartmentId())
                        .orElseThrow(() -> new RuntimeException("Department not found with ID: " + userDto.getDepartmentId()));
                user.setDepartment(department);
            }

            // Cập nhật role nếu có
            if (userDto.getRoleId() != null) {
                Role role = roleRepository.findById(userDto.getRoleId())
                        .orElseThrow(() -> new RuntimeException("Role not found with ID: " + userDto.getRoleId()));
                user.setRole(role);
            }

            User savedUser = userRepository.save(user);
            return userMapper.toDto(savedUser);
        });
    }

    /**
     * Xóa người dùng (hard delete)
     */
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Vô hiệu hóa tài khoản người dùng (soft delete)
     */
    public boolean deactivateUser(Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setIsActive(false);
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }

    /**
     * Tìm kiếm người dùng theo tên (không phân biệt hoa thường)
     */
    public List<UserDto> findUsersByName(String name) {
        List<User> users = userRepository.findByFullNameContainingIgnoreCase(name);
        return users.stream().map(userMapper::toDto).toList(); // Sử dụng mapper thay vì duplicate conversion
    }

}
