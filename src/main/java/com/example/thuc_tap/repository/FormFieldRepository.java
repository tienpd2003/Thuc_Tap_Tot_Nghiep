package com.example.thuc_tap.repository;

import com.example.thuc_tap.entity.FormField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormFieldRepository extends JpaRepository<FormField, Long> {
    
    List<FormField> findByFormTemplateId(Long formTemplateId);
    
    @Query("SELECT f FROM FormField f WHERE f.formTemplate.id = :formTemplateId ORDER BY f.fieldOrder")
    List<FormField> findByFormTemplateIdOrderByFieldOrder(@Param("formTemplateId") Long formTemplateId);
    
    List<FormField> findByFieldTypeId(Long fieldTypeId);
    
    boolean existsByFormTemplateIdAndFieldName(Long formTemplateId, String fieldName);
}
