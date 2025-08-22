package com.example.thuc_tap.validation;

/**
 * Validation groups for different operations
 */
public class ValidationGroups {
    
    /**
     * Group for user creation operations
     */
    public interface CreateUser {}
    
    /**
     * Group for user update operations
     */
    public interface UpdateUser {}
    
    /**
     * Default group for common validations
     */
    public interface Default {}
}
