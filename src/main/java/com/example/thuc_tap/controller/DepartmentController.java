package com.example.thuc_tap.controller;

import com.example.thuc_tap.dto.DepartmentDto;
import com.example.thuc_tap.dto.UserDto;
import com.example.thuc_tap.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<DepartmentDto>> getAllDepartments(@RequestParam(defaultValue = "false") boolean activeOnly) {
        List<DepartmentDto> departments;
        if (activeOnly) {
            departments = departmentService.getActiveDepartments();
        } else {
            departments = departmentService.getAllDepartments();
        }
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDto> getDepartmentById(@PathVariable Long id) {
        Optional<DepartmentDto> department = departmentService.getDepartmentById(id);
        return department.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DepartmentDto> createDepartment(@Valid @RequestBody DepartmentDto departmentDto) {
        try {
            DepartmentDto createdDepartment = departmentService.createDepartment(departmentDto);
            return ResponseEntity.ok(createdDepartment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentDto> updateDepartment(@PathVariable Long id, @Valid @RequestBody DepartmentDto departmentDto) {
        try {
            Optional<DepartmentDto> updatedDepartment = departmentService.updateDepartment(id, departmentDto);
            return updatedDepartment.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        try {
            boolean deleted = departmentService.deleteDepartment(id);
            return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateDepartment(@PathVariable Long id) {
        boolean deactivated = departmentService.deactivateDepartment(id);
        return deactivated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/users")
    public ResponseEntity<List<UserDto>> getUsersByDepartment(@PathVariable Long id) {
        List<UserDto> users = departmentService.getUsersByDepartment(id);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/head")
    public ResponseEntity<DepartmentDto> updateDepartmentHead(@PathVariable Long id, @RequestBody Long headUserId) {
        try {
            Optional<DepartmentDto> updatedDepartment = departmentService.updateDepartmentHead(id, headUserId);
            return updatedDepartment.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}/head")
    public ResponseEntity<DepartmentDto> removeDepartmentHead(@PathVariable Long id) {
        try {
            Optional<DepartmentDto> updatedDepartment = departmentService.updateDepartmentHead(id, null);
            return updatedDepartment.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
