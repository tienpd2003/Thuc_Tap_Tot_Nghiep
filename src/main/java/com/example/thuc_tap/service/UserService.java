package com.example.thuc_tap.service;

import com.example.thuc_tap.dto.UserDto;
import com.example.thuc_tap.entity.Department;
import com.example.thuc_tap.entity.Role;
import com.example.thuc_tap.entity.User;
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
    private RoleRepository roleRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::convertToDto).toList();
    }

    public Optional<UserDto> getUserById(Long id) {
        return userRepository.findById(id).map(this::convertToDto);
    }

    public Optional<UserDto> getUserByUsername(String username) {
        return userRepository.findByUsername(username).map(this::convertToDto);
    }

    public UserDto createUser(UserDto userDto) {
        User user = new User();
        user.setEmployeeCode(userDto.getEmployeeCode());
        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());
        user.setFullName(userDto.getFullName());
        user.setEmail(userDto.getEmail());
        user.setPhone(userDto.getPhone());
        user.setIsActive(userDto.getIsActive());
        user.setRole(getRoleById(userDto.getRoleId()));
        if (userDto.getDepartmentId() != null) {
            user.setDepartment(getDepartmentById(userDto.getDepartmentId()));
        }
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
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

            User savedUser = userRepository.save(user);
            return convertToDto(savedUser);
        });
    }

    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private UserDto convertToDto(User user) {
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
    private Role getRoleById(Long roleId) {
        return roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + roleId));
    }
    private Department getDepartmentById(Long departmentId) {
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + departmentId));
    }
}
