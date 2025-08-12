package com.example.thuc_tap.repository;

import com.example.thuc_tap.entity.PriorityLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PriorityLevelRepository extends JpaRepository<PriorityLevel, Long> {
    
    Optional<PriorityLevel> findByName(String name);
    
    boolean existsByName(String name);
}
