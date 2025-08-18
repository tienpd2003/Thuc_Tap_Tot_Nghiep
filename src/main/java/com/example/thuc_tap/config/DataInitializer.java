package com.example.thuc_tap.config;

import com.example.thuc_tap.entity.*;
import com.example.thuc_tap.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

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

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private FormTemplateRepository formTemplateRepository;

    @Autowired
    private ApprovalTaskRepository approvalTaskRepository;

    @Autowired
    private TicketApprovalRepository ticketApprovalRepository;

    @Autowired
    private ApprovalWorkflowRepository approvalWorkflowRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeDepartments();
        initializeUsers();
        initializeFieldTypes();
        initializeTicketStatuses();
        initializePriorityLevels();
        initializeSampleFormTemplateAndWorkflow();
        initializeSampleTicketAndApprovalTask();
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
    private void initializeSampleFormTemplateAndWorkflow() {
        // if a form template exists, keep it
        if (formTemplateRepository.count() > 0) {
            // ensure workflow exists
            if (approvalWorkflowRepository.count() == 0) {
                FormTemplate any = formTemplateRepository.findAll().stream().findFirst().orElse(null);
                if (any != null) {
                    ApprovalWorkflow wf = new ApprovalWorkflow();
                    wf.setName("Default IT approval");
                    wf.setFormTemplate(any);
                    wf.setStepOrder(0);
                    wf.setStepName("Step 1 - Approver review");       // <- required
                    wf.setDepartment(any.getCreatedBy() != null ? any.getCreatedBy().getDepartment() : null);
                    // simple JSON string (if your column is jsonb you'll need proper JSON binding)
                    wf.setDefinition("{ \"steps\": [ { \"index\": 0, \"type\": \"parallel\", \"rule\": \"any\", \"approvers\": [ { \"type\": \"role\", \"name\": \"APPROVER\" } ] } ] }");
                    approvalWorkflowRepository.save(wf);
                }
            }
            return;
        }

        // find a user to set as createdBy (prefer admin)
        User createdBy = userRepository.findByUsername("admin")
                .or(() -> userRepository.findByUsername("approver"))
                .or(() -> userRepository.findAll().stream().findFirst())
                .orElse(null);

        if (createdBy == null) {
            // users not ready yet; skip
            return;
        }

        // create and save FormTemplate with createdBy set
        FormTemplate t = new FormTemplate();
        t.setName("Request - IT equipment");
        t.setDescription("Request for new hardware / monitor");
        t.setIsActive(true);
        t.setCreatedBy(createdBy);        // IMPORTANT for NOT NULL created_by
        FormTemplate saved = formTemplateRepository.save(t);

        // create a linked ApprovalWorkflow and set required fields
        ApprovalWorkflow wf = new ApprovalWorkflow();
        wf.setName("Default IT approval");
        wf.setFormTemplate(saved);                        // required if column is NOT NULL
        wf.setStepOrder(0);                               // required in your entity
        wf.setStepName("Step 1 - Approver review");      // required in DB
        wf.setDepartment(saved.getCreatedBy().getDepartment()); // optional but helpful
        wf.setDefinition("{ \"steps\": [ { \"index\": 0, \"type\": \"parallel\", \"rule\": \"any\", \"approvers\": [ { \"type\": \"role\", \"name\": \"APPROVER\" } ] } ] }");
        approvalWorkflowRepository.save(wf);
    }


    private void initializeSampleTicketAndApprovalTask() {
        // do not create if approval tasks already exist
        if (approvalTaskRepository.count() > 0) return;

        // find requester (employee) and approver
        Optional<User> requesterOpt = userRepository.findByUsername("employee");
        Optional<User> approverOpt = userRepository.findByUsername("approver");
        if (requesterOpt.isEmpty() || approverOpt.isEmpty()) {
            // users not ready yet; skip
            return;
        }

        User requester = requesterOpt.get();
        User approver = approverOpt.get();

        // pick a pending status
        TicketStatus pendingStatus = ticketStatusRepository.findByName("PENDING").orElse(null);
        if (pendingStatus == null) {
            // cannot create ticket without status
            return;
        }

        // pick a form template (if any)
        FormTemplate template = formTemplateRepository.findAll().stream().findFirst().orElse(null);

        // create ticket
        Ticket ticket = new Ticket();
        ticket.setTicketCode("TICKET-" + System.currentTimeMillis());
        ticket.setTitle("Yêu cầu màn hình mới");
        ticket.setDescription("Xin cấp 01 màn hình 24 inch cho nhân viên");
        ticket.setRequester(requester);
        ticket.setFormTemplate(template);
        ticket.setDepartment(requester.getDepartment());
        ticket.setCurrentStatus(pendingStatus);
        ticket.setCreatedAt(LocalDateTime.now());
        Ticket savedTicket = ticketRepository.save(ticket);

        // create approval task assigned to approver
        ApprovalTask task = new ApprovalTask();
        task.setTicket(savedTicket);
        task.setStepIndex(0);
        task.setApprover(approver);
        task.setApproverRole(approver.getRole() != null ? approver.getRole().getName() : null);
        task.setStatus(ApprovalTaskStatus.valueOf("PENDING"));
        task.setAssignedAt(LocalDateTime.now());

        // ===== create a JsonNode meta (avoid using raw JSON string) =====
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode metaNode = mapper.createObjectNode();
        metaNode.put("createdBy", requester.getUsername());
        metaNode.put("note", "auto-created by initializer");
        metaNode.put("ticketId", savedTicket.getId() != null ? savedTicket.getId() : -1);
        task.setMeta(metaNode);

        approvalTaskRepository.save(task);
    }
}
