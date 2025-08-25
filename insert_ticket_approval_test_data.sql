-- Test data for ticket_approvals table
-- Giả sử có workflow steps và tickets đã tồn tại

-- Insert some approval workflow steps first (if not exists)
INSERT INTO approval_workflows (form_template_id, step_order, department_id, approver_id, step_name, name, definition, created_at) 
VALUES 
(1, 1, 1, 4, 'HR Review', 'HR Manager Approval', 'HR department review', NOW()),
(1, 2, 2, 5, 'IT Review', 'IT Manager Approval', 'IT department review', NOW()),
(2, 1, 1, 4, 'HR Review', 'HR Manager Approval', 'HR department review', NOW())
ON CONFLICT DO NOTHING;

-- Insert some test tickets (if not exists)
INSERT INTO tickets (ticket_code, title, description, requester_id, department_id, form_template_id, priority_id, status_id, created_at, updated_at)
VALUES 
('TK001', 'Yêu cầu nghỉ phép', 'Xin nghỉ phép từ ngày 01/01/2025', 1, 1, 1, 1, 1, NOW(), NOW()),
('TK002', 'Yêu cầu tăng lương', 'Xin xem xét tăng lương sau 1 năm làm việc', 2, 1, 1, 2, 1, NOW(), NOW()),
('TK003', 'Yêu cầu cấp laptop', 'Cần laptop mới cho công việc', 3, 2, 2, 1, 1, NOW(), NOW()),
('TK004', 'Yêu cầu training', 'Đăng ký khóa học Java Spring Boot', 1, 2, 2, 3, 1, NOW(), NOW())
ON CONFLICT (ticket_code) DO NOTHING;

-- Insert test ticket approvals
-- Scenario: User ID 4 (Nguyễn Thị Hoa) có:
-- - 2 tickets chờ duyệt (PENDING)
-- - 1 ticket đã duyệt (APPROVE) 
-- - 1 ticket từ chối (REJECT)

INSERT INTO ticket_approvals (ticket_id, approver_id, workflow_step_id, action, status_id, comments, created_at)
VALUES 
-- Tickets chờ duyệt (PENDING) - approver_id = 4
(1, 4, 1, 'PENDING', 1, NULL, NOW()),
(2, 4, 1, 'PENDING', 1, NULL, NOW()),

-- Tickets đã xử lý
(3, 4, 1, 'APPROVE', 2, 'Đồng ý cấp laptop cho nhân viên', NOW() - INTERVAL '1 day'),
(4, 4, 1, 'REJECT', 3, 'Từ chối do ngân sách không đủ', NOW() - INTERVAL '2 day')
ON CONFLICT DO NOTHING;
