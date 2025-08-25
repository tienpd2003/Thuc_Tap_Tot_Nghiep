package com.example.thuc_tap.controller;

import com.example.thuc_tap.dto.UserDto;
import com.example.thuc_tap.service.UserService;
import com.example.thuc_tap.validation.ValidationGroups;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        Optional<UserDto> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@Validated(ValidationGroups.CreateUser.class) @RequestBody UserDto userDto) {
        UserDto createdUser = userService.createUser(userDto);
        return ResponseEntity.ok(createdUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @Validated(ValidationGroups.UpdateUser.class) @RequestBody UserDto userDto) {
        Optional<UserDto> updatedUser = userService.updateUser(id, userDto);
        return updatedUser.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long id) {
        boolean deactivated = userService.deactivateUser(id);
        return deactivated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> findUsersByName(@RequestParam String name) {
        List<UserDto> users = userService.findUsersByName(name);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/department/{departmentId}/approvers")
    public ResponseEntity<List<UserDto>> getApproversByDepartment(@PathVariable Long departmentId) {
        List<UserDto> approvers = userService.getApproversByDepartment(departmentId);
        return ResponseEntity.ok(approvers);
    }
}
