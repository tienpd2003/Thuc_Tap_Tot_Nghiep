package com.example.thuc_tap.repository;

import com.example.thuc_tap.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.role LEFT JOIN FETCH u.department WHERE u.username = :username")
    Optional<User> findByUsername(@Param("username") String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmployeeCode(String employeeCode);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByEmployeeCode(String employeeCode);
    
    List<User> findByDepartmentId(Long departmentId);
    
    List<User> findByRoleId(Long roleId);
    
    List<User> findByIsActive(Boolean isActive);
    
    List<User> findByFullNameContainingIgnoreCase(String fullName);
    
    @Query("SELECT u FROM User u WHERE u.department.id = :departmentId AND u.role.name = 'APPROVER'")
    List<User> findApproversByDepartment(@Param("departmentId") Long departmentId);
    
    @Query("SELECT u FROM User u WHERE u.role.name = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);
    
    @Query("SELECT u FROM User u WHERE u.department.id = :departmentId AND u.role.name = :roleName ORDER BY u.id ASC")
    List<User> findByDepartmentIdAndRoleName(@Param("departmentId") Long departmentId, @Param("roleName") String roleName);
    // Admin Statistics Methods - Phương thức thống kê cho Admin Dashboard
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = :isActive")
    Long countByIsActive(@Param("isActive") Boolean isActive);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.department.id = :departmentId AND u.isActive = :isActive")
    Long countByDepartmentIdAndIsActive(@Param("departmentId") Long departmentId, @Param("isActive") Boolean isActive);
    
    // ========== NEW METHODS FOR USER GROWTH STATISTICS ==========
    
    /**
     * Đếm số người dùng được tạo trong khoảng thời gian
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :startDate AND u.createdAt < :endDate")
    Long countByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Đếm tổng số người dùng được tạo trước thời điểm nhất định
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt < :endDate")
    Long countByCreatedAtLessThan(@Param("endDate") LocalDateTime endDate);
    
    /**
     * Lấy danh sách người dùng mới đăng ký gần đây với phân trang
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.role LEFT JOIN FETCH u.department WHERE u.isActive = :isActive ORDER BY u.createdAt DESC")
    List<User> findByIsActiveWithPagination(@Param("isActive") Boolean isActive, Pageable pageable);
    
    /**
     * Lấy danh sách người dùng theo trạng thái, có thông tin đầy đủ, sắp xếp theo thời gian tạo
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.role LEFT JOIN FETCH u.department WHERE u.isActive = :isActive ORDER BY u.createdAt DESC")
    List<User> findByIsActiveOrderByCreatedAtDesc(@Param("isActive") Boolean isActive);
}
