INSERT INTO roles (name, description, created_at)
VALUES
    ('EMPLOYEE', 'Nhân viên', NOW()),
    ('APPROVER', 'Người phê duyệt', NOW()),
    ('ADMIN', 'Quản trị hệ thống', NOW());

INSERT INTO departments (name, description, is_active, created_at)
VALUES
    ('Human Resources', 'Quản lý nhân sự', true, NOW()),
    ('Accounting', 'Quản lý tài chính', true, NOW()),
    ('Technical Support', 'Hỗ trợ kỹ thuật', true, NOW()),
    ('Sales', 'Phát triển kinh doanh', true, NOW()),
    ('Administration', 'Quản lý hành chính', true, NOW()),
    ('Product Management', 'Quản lý sản phẩm và roadmap', true, NOW()),
    ('Software Development', 'Lập trình và phát triển hệ thống', true, NOW()),
    ('Quality Assurance', 'Đảm bảo chất lượng phần mềm', true, NOW()),
    ('IT Infrastructure', 'Quản lý hệ thống mạng, máy chủ', true, NOW()),
    ('Marketing', 'Quảng bá và truyền thông', true, NOW()),
    ('Customer Support', 'Hỗ trợ và chăm sóc khách hàng', true, NOW());

INSERT INTO field_types (name, description)
VALUES
    ('TEXT', 'Trường nhập văn bản một dòng'),
    ('NUMBER', 'Trường nhập số'),
    ('DATE', 'Trường chọn ngày'),
    ('DATETIME', 'Trường chọn ngày giờ'),
    ('FILE', 'Trường tải lên tệp'),
    ('SELECT', 'Trường chọn một giá trị từ danh sách'),
    ('TEXTAREA', 'Trường nhập văn bản nhiều dòng'),
    ('CHECKBOX', 'Trường chọn nhiều tùy chọn'),
    ('RADIO', 'Trường chọn một tùy chọn duy nhất'),
    ('EMAIL', 'Trường nhập địa chỉ email'),
    ('PHONE', 'Trường nhập số điện thoại');

INSERT INTO users (employee_code, username, password, full_name, email, phone, department_id, role_id, is_active, created_at)
VALUES
    ('EMP001', 'linh.nguyenthi', '123456', 'Nguyễn Thị Linh', 'linh.nguyenthi@company.com', '0905123456',
     1, 1, true, NOW()),
    ('APP001', 'hung.tranvan', '123456', 'Trần Văn Hùng', 'hung.tranvan@company.com', '0912345678',
     2, 2, true, NOW()),
    ('ADM001', 'minh.lequang', '123456', 'Lê Quang Minh', 'minh.lequang@company.com', '0987654321',
     9, 3, true, NOW());

INSERT INTO priority_levels (name, level_value, description, created_at)
VALUES
    ('LOW', 1, 'Mức độ ưu tiên thấp', NOW()),
    ('MEDIUM', 2, 'Mức độ ưu tiên trung bình', NOW()),
    ('HIGH', 3, 'Mức độ ưu tiên cao', NOW()),
    ('URGENT', 4, 'Mức độ ưu tiên khẩn cấp', NOW());

INSERT INTO ticket_statuses (name, description, created_at)
VALUES
    ('PENDING', 'Chờ xử lý', NOW()),
    ('IN_PROGRESS', 'Đang xử lý', NOW()),
    ('COMPLETED', 'Hoàn thành', NOW()),
    ('CANCELLED', 'Đã hủy', NOW()),
    ('REJECTED', 'Từ chối', NOW());

-- Sample tickets cho user Nguyễn Thị Linh (ID: 1)
INSERT INTO tickets (title, description, requester_id, department_id, priority_id, status_id, due_date, created_at, updated_at)
VALUES
    ('Yêu cầu cấp laptop mới', 'Laptop hiện tại bị chậm, cần cấp laptop mới để làm việc hiệu quả', 1, 3, 3, 2, 
     DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW()),
    ('Đơn xin nghỉ phép', 'Xin nghỉ phép từ ngày 25/1 đến 30/1 để về quê ăn Tết', 1, 1, 2, 1,
     DATE_ADD(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 4 HOUR), NOW()),
    ('Sửa chữa máy in văn phòng', 'Máy in tầng 2 bị kẹt giấy, không in được', 1, 3, 3, 3,
     DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
    ('Yêu cầu tăng lương', 'Đề xuất tăng lương sau 1 năm làm việc', 1, 1, 2, 1,
     DATE_ADD(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), NOW());


