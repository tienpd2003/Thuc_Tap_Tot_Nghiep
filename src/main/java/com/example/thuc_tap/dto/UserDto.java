package com.example.thuc_tap.dto;

import com.example.thuc_tap.validation.ValidationGroups;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    
    private Long id;
    
    @NotBlank(message = "Employee code is required", groups = {ValidationGroups.CreateUser.class})
    @Size(max = 20, message = "Employee code must not exceed 20 characters", groups = {ValidationGroups.CreateUser.class, ValidationGroups.UpdateUser.class})
    private String employeeCode;
    
    @NotBlank(message = "Username is required", groups = {ValidationGroups.CreateUser.class})
    @Size(max = 50, message = "Username must not exceed 50 characters", groups = {ValidationGroups.CreateUser.class, ValidationGroups.UpdateUser.class})
    private String username;
    
    @NotBlank(message = "Password is required", groups = {ValidationGroups.CreateUser.class})
    @Size(min = 6, message = "Password must be at least 6 characters", groups = {ValidationGroups.CreateUser.class, ValidationGroups.UpdateUser.class})
    private String password;
    
    @NotBlank(message = "Full name is required", groups = {ValidationGroups.CreateUser.class, ValidationGroups.UpdateUser.class})
    @Size(max = 100, message = "Full name must not exceed 100 characters", groups = {ValidationGroups.CreateUser.class, ValidationGroups.UpdateUser.class})
    private String fullName;
    
    @NotBlank(message = "Email is required", groups = {ValidationGroups.CreateUser.class, ValidationGroups.UpdateUser.class})
    @Email(message = "Email should be valid", groups = {ValidationGroups.CreateUser.class, ValidationGroups.UpdateUser.class})
    @Size(max = 100, message = "Email must not exceed 100 characters", groups = {ValidationGroups.CreateUser.class, ValidationGroups.UpdateUser.class})
    private String email;
    
    @Size(max = 20, message = "Phone must not exceed 20 characters", groups = {ValidationGroups.CreateUser.class, ValidationGroups.UpdateUser.class})
    private String phone;
    
    private Long departmentId;
    private String departmentName;

    @NotNull(message = "roleId is required", groups = {ValidationGroups.CreateUser.class, ValidationGroups.UpdateUser.class})
    @Positive(message = "roleId must be a positive number", groups = {ValidationGroups.CreateUser.class, ValidationGroups.UpdateUser.class})
    private Long roleId;
    private String roleName;
    
    private Boolean isActive = true;
}
