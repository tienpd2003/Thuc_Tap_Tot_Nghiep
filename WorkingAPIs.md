# Working APIs Documentation

## 🔄 Merge Resolution (Aug 16, 2025)
**Đã giải quyết conflict từ main branch:**
- ✅ **UserService.java**: Kết hợp logic từ cả 2 branch
  - Giữ lại mapper pattern (UserMapper) 
  - Giữ lại logic ADMIN role không cần phòng ban
  - Thêm chức năng deactivateUser và findUsersByName
  - Thêm Vietnamese comments giải thích merge changes
- ✅ **UserDto.java**: Thêm validation cho roleId (@NotNull, @Positive)
- ✅ **Các entity/service mới**: Approval, ApprovalAction, ApprovalTask từ main branch
- ✅ **Compile thành công**: Tất cả 54 source files compiled successfully

📋 All Working APIs
## User Management (7 APIs)
    GET /api/users - List all users
    GET /api/users/{id} - Get user by ID
    GET /api/users/search?name={name} - NEW: Search by name
    POST /api/users - Create user (with ADMIN logic)
    PUT /api/users/{id} - Update user (Cannot update employeeCode and username)
    PUT /api/users/{id}/deactivate - NEW: Deactivate user
    DELETE /api/users/{id} - Delete user
## Department Management (8 APIs)
    GET /api/departments - List all departments
    GET /api/departments?activeOnly=true - List active departments
    GET /api/departments/{id} - Get department by ID
    GET /api/departments/{id}/users - Get users in department
    POST /api/departments - Create department
    PUT /api/departments/{id} - Update department
    PUT /api/departments/{id}/deactivate - Deactivate department
    DELETE /api/departments/{id} - Delete department
## Role Management (8 APIs)
    GET /api/roles - List all roles
    GET /api/roles/{id} - Get role by ID
    GET /api/roles/name/{name} - Get role by name
    GET /api/roles/{id}/users - Get users with role
    GET /api/roles/name/{name}/users - Get users by role name
    POST /api/roles - Create role
    PUT /api/roles/{id} - Update role
    DELETE /api/roles/{id} - Delete role

## Remaining MyJob Functions (Future Implementation)

### Admin Dashboard/Thống kê hệ thống:
- ⏳ Xây dựng dashboard: biểu đồ xu hướng, trạng thái ticket
- ⏳ Biểu đồ hiệu suất phòng ban
- ⏳ Thẻ thống kê tổng số ticket, số người dùng, tỷ lệ xử lí
- ⏳ Chức năng xuất báo cáo PDF/Excel

### Backend (Additional):
- ⏳ Lịch sử hoạt động
- ⏳ API thống kê
- ⏳ Tối ưu truy vấn cho thống kê, lọc

---

## 🏗️ Architecture Improvements

Recent Spring Boot best practices implemented for better code quality:

### ✅ Global Exception Handling
- **Files Added**: `GlobalExceptionHandler.java`, `ErrorResponse.java`, `ValidationErrorResponse.java`
- **Benefits**: Consistent error responses across all APIs, cleaner controller code, better error messages for frontend
- **Impact**: Improved error handling without changing API contracts

### ✅ Mapper Pattern 
- **Files Added**: `UserMapper.java`, `DepartmentMapper.java`
- **Benefits**: Centralized entity ↔ DTO conversion, easier maintenance, reusable logic
- **Impact**: Internal refactoring only, same API behavior

### ✅ Enhanced Validation (Optional)
- **Files Added**: `@UniqueUsername` annotation and validator
- **Benefits**: Custom business rule validation, cleaner DTOs
- **Impact**: Can be extended for other business rules

**Result**: All existing APIs work exactly the same, just with improved internal structure and better error responses.

---

## Error Handling

All APIs include comprehensive error handling:
- **400 Bad Request**: Validation errors, business rule violations
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Unexpected errors

### Common Error Scenarios:
- Creating user without required role
- Creating non-ADMIN user without department
- Duplicate usernames, emails, employee codes
- Deleting departments/roles with existing users
- Invalid department/role IDs