package com.example.thuc_tap.repository;

import com.example.thuc_tap.entity.FieldType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FieldTypeRepository extends JpaRepository<FieldType, Long> {
    
    Optional<FieldType> findByName(String name);
    
    boolean existsByName(String name);
}
