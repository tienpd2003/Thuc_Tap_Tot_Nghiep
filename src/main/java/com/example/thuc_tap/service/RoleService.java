package com.example.thuc_tap.service;

import com.example.thuc_tap.dto.RoleDto;
import com.example.thuc_tap.dto.UserDto;
import com.example.thuc_tap.entity.Role;
import com.example.thuc_tap.entity.User;
import com.example.thuc_tap.repository.RoleRepository;
import com.example.thuc_tap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    public List<RoleDto> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        return roles.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<RoleDto> getRoleById(Long id) {
        return roleRepository.findById(id)
                .map(this::convertToDtoWithUsers);
    }

    public Optional<RoleDto> getRoleByName(String name) {
        return roleRepository.findByName(name)
                .map(this::convertToDto);
    }

    public RoleDto createRole(RoleDto roleDto) {
        // Check if role with same name already exists
        if (roleRepository.existsByName(roleDto.getName())) {
            throw new RuntimeException("Role with name '" + roleDto.getName() + "' already exists");
        }

        Role role = convertToEntity(roleDto);
        Role savedRole = roleRepository.save(role);
        return convertToDto(savedRole);
    }

    public Optional<RoleDto> updateRole(Long id, RoleDto roleDto) {
        return roleRepository.findById(id)
                .map(existingRole -> {
                    // Check if new name conflicts with existing roles (excluding current one)
                    if (!existingRole.getName().equals(roleDto.getName()) &&
                        roleRepository.existsByName(roleDto.getName())) {
                        throw new RuntimeException("Role with name '" + roleDto.getName() + "' already exists");
                    }

                    existingRole.setName(roleDto.getName());
                    existingRole.setDescription(roleDto.getDescription());

                    Role updatedRole = roleRepository.save(existingRole);
                    return convertToDto(updatedRole);
                });
    }

    public boolean deleteRole(Long id) {
        return roleRepository.findById(id)
                .map(role -> {
                    // Check if there are users with this role
                    List<User> usersWithRole = userRepository.findByRoleId(id);
                    if (!usersWithRole.isEmpty()) {
                        throw new RuntimeException("Cannot delete role with existing users. Please reassign users first.");
                    }

                    roleRepository.delete(role);
                    return true;
                })
                .orElse(false);
    }

    public List<UserDto> getUsersByRole(Long roleId) {
        List<User> users = userRepository.findByRoleId(roleId);
        return users.stream()
                .map(this::convertUserToDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> getUsersByRoleName(String roleName) {
        List<User> users = userRepository.findByRoleName(roleName);
        return users.stream()
                .map(this::convertUserToDto)
                .collect(Collectors.toList());
    }

    private RoleDto convertToDto(Role role) {
        RoleDto dto = new RoleDto();
        dto.setId(role.getId());
        dto.setName(role.getName());
        dto.setDescription(role.getDescription());
        dto.setCreatedAt(role.getCreatedAt());

        // Count users with this role
        long userCount = userRepository.findByRoleId(role.getId()).size();
        dto.setUserCount(userCount);

        return dto;
    }

    private RoleDto convertToDtoWithUsers(Role role) {
        RoleDto dto = convertToDto(role);

        // Add users list for detailed view
        List<User> users = userRepository.findByRoleId(role.getId());
        List<UserDto> userDtos = users.stream()
                .map(this::convertUserToDto)
                .collect(Collectors.toList());
        dto.setUsers(userDtos);

        return dto;
    }

    private Role convertToEntity(RoleDto roleDto) {
        Role role = new Role();
        role.setName(roleDto.getName());
        role.setDescription(roleDto.getDescription());
        return role;
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
