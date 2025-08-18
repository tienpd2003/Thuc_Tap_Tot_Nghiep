package com.example.thuc_tap.repository;

import com.example.thuc_tap.entity.ApprovalWorkflow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApprovalWorkflowRepository extends JpaRepository<ApprovalWorkflow, Long> {
    Optional<ApprovalWorkflow> findByFormTemplateId(Long formTemplateId);
}