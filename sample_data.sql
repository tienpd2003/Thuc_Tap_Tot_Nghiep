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
     9, 3, true, NOW()),
    -- Approvers for each department
    ('APP002', 'hoa.nguyenthi', '123456', 'Nguyễn Thị Hoa', 'hoa.nguyenthi@company.com', '0901234567',
     1, 2, true, NOW()), -- HR Department
    ('APP003', 'duc.nguyenvan', '123456', 'Nguyễn Văn Đức', 'duc.nguyenvan@company.com', '0902345678',
     2, 2, true, NOW()), -- Accounting Department  
    ('APP004', 'lan.tranthi', '123456', 'Trần Thị Lan', 'lan.tranthi@company.com', '0903456789',
     3, 2, true, NOW()), -- Technical Support Department
    ('APP005', 'phong.levan', '123456', 'Lê Văn Phong', 'phong.levan@company.com', '0904567890',
     4, 2, true, NOW()), -- Sales Department
    ('APP006', 'thao.nguyenthi', '123456', 'Nguyễn Thị Thảo', 'thao.nguyenthi@company.com', '0905678901',
     5, 2, true, NOW()), -- Administration Department
    ('APP007', 'tuan.hoangvan', '123456', 'Hoàng Văn Tuấn', 'tuan.hoangvan@company.com', '0906789012',
     6, 2, true, NOW()), -- Product Management Department
    ('APP008', 'nam.nguyenvan', '123456', 'Nguyễn Văn Nam', 'nam.nguyenvan@company.com', '0907890123',
     7, 2, true, NOW()), -- Software Development Department
    ('APP009', 'mai.lethi', '123456', 'Lê Thị Mai', 'mai.lethi@company.com', '0908901234',
     8, 2, true, NOW()), -- Quality Assurance Department
    ('APP010', 'khanh.nguyenvan', '123456', 'Nguyễn Văn Khánh', 'khanh.nguyenvan@company.com', '0909012345',
     9, 2, true, NOW()), -- IT Infrastructure Department
    ('APP011', 'linh.tranthi', '123456', 'Trần Thị Linh', 'linh.tranthi@company.com', '0900123456',
     10, 2, true, NOW()), -- Marketing Department
    ('APP012', 'hien.nguyenthi', '123456', 'Nguyễn Thị Hiền', 'hien.nguyenthi@company.com', '0901234567',
     11, 2, true, NOW()); -- Customer Support Department


INSERT INTO priority_levels (name, description)
VALUES
    ('LOW', 'Mức độ ưu tiên thấp'),
    ('MEDIUM',  'Mức độ ưu tiên trung bình'),
    ('HIGH',  'Mức độ ưu tiên cao'),
    ('URGENT', 'Mức độ ưu tiên khẩn cấp');


INSERT INTO ticket_status (name, description)
VALUES
    ('PENDING', 'Chờ xử lý'),
    ('IN_PROGRESS', 'Đang xử lý'),
    ('COMPLETED', 'Hoàn thành'),
    ('CANCELLED', 'Đã hủy'),
    ('REJECTED', 'Từ chối');





