-- Thêm column department_head_id vào bảng departments
ALTER TABLE departments ADD COLUMN IF NOT EXISTS department_head_id BIGINT;

-- Thêm foreign key constraint
ALTER TABLE departments 
ADD CONSTRAINT fk_departments_department_head 
FOREIGN KEY (department_head_id) REFERENCES users(id) ON DELETE SET NULL;

-- Comment cho column
COMMENT ON COLUMN departments.department_head_id IS 'ID của user làm trưởng phòng ban';
