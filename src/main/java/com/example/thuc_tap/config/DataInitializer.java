package com.example.thuc_tap.config;

import com.example.thuc_tap.entity.*;
import com.example.thuc_tap.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FieldTypeRepository fieldTypeRepository;

    @Autowired
    private TicketStatusRepository ticketStatusRepository;

    @Autowired
    private PriorityLevelRepository priorityLevelRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeDepartments();
        initializeUsers();
        initializeFieldTypes();
        initializeTicketStatuses();
        initializePriorityLevels();
    }

    private void initializeRoles() {
        if (roleRepository.count() == 0) {
            Role employeeRole = new Role();
            employeeRole.setName("EMPLOYEE");
            employeeRole.setDescription("Nhân viên thường");
            roleRepository.save(employeeRole);

            Role approverRole = new Role();
            approverRole.setName("APPROVER");
            approverRole.setDescription("Người duyệt");
            roleRepository.save(approverRole);

            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            adminRole.setDescription("Quản trị viên");
            roleRepository.save(adminRole);
        }
    }

    private void initializeDepartments() {
        if (departmentRepository.count() == 0) {
            Department itDept = new Department();
            itDept.setName("Phòng IT");
            itDept.setDescription("Phòng Công nghệ thông tin");
            itDept.setIsActive(true);
            departmentRepository.save(itDept);

            Department hrDept = new Department();
            hrDept.setName("Phòng Nhân sự");
            hrDept.setDescription("Phòng Nhân sự");
            hrDept.setIsActive(true);
            departmentRepository.save(hrDept);

            Department financeDept = new Department();
            financeDept.setName("Phòng Tài chính");
            financeDept.setDescription("Phòng Tài chính");
            financeDept.setIsActive(true);
            departmentRepository.save(financeDept);
        }
    }

    private void initializeUsers() {
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName("ADMIN").orElse(null);
            Role employeeRole = roleRepository.findByName("EMPLOYEE").orElse(null);
            Role approverRole = roleRepository.findByName("APPROVER").orElse(null);

            Department itDept = departmentRepository.findByName("Phòng IT").orElse(null);

            // Admin user
            User admin = new User();
            admin.setEmployeeCode("ADMIN001");
            admin.setUsername("admin");
            admin.setPassword("123456");
            admin.setFullName("Administrator");
            admin.setEmail("admin@company.com");
            admin.setPhone("0123456789");
            admin.setDepartment(itDept);
            admin.setRole(adminRole);
            admin.setIsActive(true);
            userRepository.save(admin);

            // Employee user
            User employee = new User();
            employee.setEmployeeCode("EMP001");
            employee.setUsername("employee");
            employee.setPassword("123456");
            employee.setFullName("Nguyễn Văn A");
            employee.setEmail("employee@company.com");
            employee.setPhone("0987654321");
            employee.setDepartment(itDept);
            employee.setRole(employeeRole);
            employee.setIsActive(true);
            userRepository.save(employee);

            // Approver user
            User approver = new User();
            approver.setEmployeeCode("APP001");
            approver.setUsername("approver");
            approver.setPassword("123456");
            approver.setFullName("Trần Thị B");
            approver.setEmail("approver@company.com");
            approver.setPhone("0123456780");
            approver.setDepartment(itDept);
            approver.setRole(approverRole);
            approver.setIsActive(true);
            userRepository.save(approver);
        }
    }

    private void initializeFieldTypes() {
        if (fieldTypeRepository.count() == 0) {
            FieldType textType = new FieldType();
            textType.setName("TEXT");
            textType.setDescription("Trường văn bản");
            fieldTypeRepository.save(textType);

            FieldType numberType = new FieldType();
            numberType.setName("NUMBER");
            numberType.setDescription("Trường số");
            fieldTypeRepository.save(numberType);

            FieldType dateType = new FieldType();
            dateType.setName("DATE");
            dateType.setDescription("Trường ngày tháng");
            fieldTypeRepository.save(dateType);

            FieldType fileType = new FieldType();
            fileType.setName("FILE");
            fileType.setDescription("Trường file");
            fieldTypeRepository.save(fileType);

            FieldType selectType = new FieldType();
            selectType.setName("SELECT");
            selectType.setDescription("Trường lựa chọn");
            fieldTypeRepository.save(selectType);

            FieldType textareaType = new FieldType();
            textareaType.setName("TEXTAREA");
            textareaType.setDescription("Trường văn bản dài");
            fieldTypeRepository.save(textareaType);
        }
    }

    private void initializeTicketStatuses() {
        if (ticketStatusRepository.count() == 0) {
            TicketStatus pending = new TicketStatus();
            pending.setName("PENDING");
            pending.setDescription("Đang chờ xử lý");
            ticketStatusRepository.save(pending);

            TicketStatus inProgress = new TicketStatus();
            inProgress.setName("IN_PROGRESS");
            inProgress.setDescription("Đang xử lý");
            ticketStatusRepository.save(inProgress);

            TicketStatus approved = new TicketStatus();
            approved.setName("APPROVED");
            approved.setDescription("Đã duyệt");
            ticketStatusRepository.save(approved);

            TicketStatus rejected = new TicketStatus();
            rejected.setName("REJECTED");
            rejected.setDescription("Từ chối");
            ticketStatusRepository.save(rejected);

            TicketStatus forwarded = new TicketStatus();
            forwarded.setName("FORWARDED");
            forwarded.setDescription("Đã chuyển tiếp");
            ticketStatusRepository.save(forwarded);
        }
    }

    private void initializePriorityLevels() {
        if (priorityLevelRepository.count() == 0) {
            PriorityLevel low = new PriorityLevel();
            low.setName("LOW");
            low.setDescription("Thấp");
            priorityLevelRepository.save(low);

            PriorityLevel medium = new PriorityLevel();
            medium.setName("MEDIUM");
            medium.setDescription("Trung bình");
            priorityLevelRepository.save(medium);

            PriorityLevel high = new PriorityLevel();
            high.setName("HIGH");
            high.setDescription("Cao");
            priorityLevelRepository.save(high);

            PriorityLevel urgent = new PriorityLevel();
            urgent.setName("URGENT");
            urgent.setDescription("Khẩn cấp");
            priorityLevelRepository.save(urgent);
        }
    }
}
