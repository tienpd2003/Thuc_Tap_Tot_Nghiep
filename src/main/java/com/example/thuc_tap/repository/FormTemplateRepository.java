package com.example.thuc_tap.repository;

import com.example.thuc_tap.entity.FormTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormTemplateRepository extends JpaRepository<FormTemplate, Long> {
    
    List<FormTemplate> findByIsActive(Boolean isActive);
    
    List<FormTemplate> findByCreatedById(Long createdById);
    
    boolean existsByName(String name);
}
