package com.example.thuc_tap.controller;

import com.example.thuc_tap.dto.LoginRequest;
import com.example.thuc_tap.dto.LoginResponse;
import com.example.thuc_tap.dto.UserDto;
import com.example.thuc_tap.entity.User;
import com.example.thuc_tap.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        // Tìm user theo username
        var userOptional = userService.getUserByUsername(loginRequest.getUsername());
        
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(new LoginResponse(null, "Bearer", null, "Invalid username or password"));
        }

        UserDto userDto = userOptional.get();
        
        // Kiểm tra password và active status trong một lần
        if (!userDto.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.badRequest()
                .body(new LoginResponse(null, "Bearer", null, "Invalid username or password"));
        }

        if (!userDto.getIsActive()) {
            return ResponseEntity.badRequest()
                .body(new LoginResponse(null, "Bearer", null, "Account is deactivated"));
        }

        // Tạo token đơn giản và response nhanh chóng
        String token = "token_" + userDto.getId() + "_" + System.currentTimeMillis();
        
        return ResponseEntity.ok(new LoginResponse(token, "Bearer", userDto, "Login successful"));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // Trong thực tế, có thể invalidate token ở đây
        return ResponseEntity.ok("Logout successful");
    }
}
