package com.example.thuc_tap.controller;

import com.example.thuc_tap.entity.PriorityLevel;
import com.example.thuc_tap.repository.PriorityLevelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/priorities")
@CrossOrigin(origins = "*")
public class PriorityController {

    @Autowired
    private PriorityLevelRepository priorityLevelRepository;

    @GetMapping
    public ResponseEntity<List<PriorityLevel>> getAll() {
        return ResponseEntity.ok(priorityLevelRepository.findAll());
    }
}


