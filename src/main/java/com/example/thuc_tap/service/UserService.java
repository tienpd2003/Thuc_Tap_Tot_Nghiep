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

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserMapper userMapper;

    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(userMapper::toDto).toList();
    }

    public Optional<UserDto> getUserById(Long id) {
        return userRepository.findById(id).map(userMapper::toDto);
    }

    public Optional<UserDto> getUserByUsername(String username) {
        return userRepository.findByUsername(username).map(userMapper::toDto);
    }

    public UserDto createUser(UserDto userDto) {
        // Validate required fields
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

        // Set role (required)
        Role role = roleRepository.findById(userDto.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found with ID: " + userDto.getRoleId()));
        user.setRole(role);

        // Set department - ADMIN role (role_id = 3) doesn't require department
        if (userDto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(userDto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found with ID: " + userDto.getDepartmentId()));
            user.setDepartment(department);
        } else if (!role.getId().equals(3L)) {
            // If not ADMIN role and no department provided, throw error
            throw new RuntimeException("Department is required for non-ADMIN roles");
        }

        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

    public Optional<UserDto> updateUser(Long id, UserDto userDto) {
        return userRepository.findById(id).map(user -> {
            user.setFullName(userDto.getFullName());
            user.setEmail(userDto.getEmail());
            user.setPhone(userDto.getPhone());
            user.setIsActive(userDto.getIsActive());

            if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
                user.setPassword(userDto.getPassword());
            }

            // Update department if provided
            if (userDto.getDepartmentId() != null) {
                Department department = departmentRepository.findById(userDto.getDepartmentId())
                        .orElseThrow(() -> new RuntimeException("Department not found with ID: " + userDto.getDepartmentId()));
                user.setDepartment(department);
            }

            // Update role if provided
            if (userDto.getRoleId() != null) {
                Role role = roleRepository.findById(userDto.getRoleId())
                        .orElseThrow(() -> new RuntimeException("Role not found with ID: " + userDto.getRoleId()));
                user.setRole(role);
            }

            User savedUser = userRepository.save(user);
            return userMapper.toDto(savedUser);
        });
    }

    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean deactivateUser(Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setIsActive(false);
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }

    public List<UserDto> findUsersByName(String name) {
        List<User> users = userRepository.findByFullNameContainingIgnoreCase(name);
        return users.stream().map(userMapper::toDto).toList();
    }
}
