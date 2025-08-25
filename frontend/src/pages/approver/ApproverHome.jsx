import { useState, useEffect } from 'react';
import { 
  MdHeadsetMic, 
  MdAssignment, 
  MdCheckCircle, 
  MdSchedule,
  MdPriorityHigh,
  MdApproval,
  MdReport,
  MdSearch,
  MdFilterList,
  MdVisibility,
  MdSort
} from "react-icons/md";
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Button, 
  Tabs, 
  Tab, 
  Box, 
  Pagination, 
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import TicketActionModal from '../../components/TicketActionModal';
import approvalService from '../../services/approvalService';
import departmentService from '../../services/departmentService';
import formTemplateService from '../../services/formTemplateService';
import { useAuth } from '../../contexts/AuthContext';

export default function ApproverHome() {
  const { user } = useAuth();
  
  // Current approver ID from authenticated user - NO fallback
  const currentApproverId = user?.id;
  
  // States
  const [stats, setStats] = useState({
    pendingTickets: 0,
    processedTickets: 0,
    approvedTickets: 0,
    rejectedTickets: 0
  });
  const [pendingTickets, setPendingTickets] = useState([]);
  const [processedTickets, setProcessedTickets] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formTemplates, setFormTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  
  // Pagination states
  const [pendingPagination, setPendingPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [processedPagination, setProcessedPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Filter states
  const [filters, setFilters] = useState({
    departmentId: null,
    formTemplateId: null,
    priority: null,
    employeeCode: '',
    q: '',
            sort: 'createdAt,desc'
  });

  // Modal states
  const [modalState, setModalState] = useState({
    visible: false,
    action: 'view', // 'approve', 'reject', 'view'
    ticketId: null,
    taskId: null
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === 'pending') {
      loadPendingTickets();
    } else {
      loadProcessedTickets();
    }
  }, [activeTab, filters, pendingPagination.current, processedPagination.current]);

  const loadInitialData = async () => {
    // Early return if no user ID
    if (!currentApproverId) {
      console.error('No user ID found, cannot load approval data');
      setStats({
        pendingTickets: 0,
        processedTickets: 0,
        approvedTickets: 0,
        rejectedTickets: 0
      });
      setDepartments([]);
      setFormTemplates([]);
      return;
    }

    try {
      // Load stats first
      const statsData = await approvalService.getApprovalStats(currentApproverId);
      setStats(statsData || {
        pendingTickets: 0,
        processedTickets: 0,
        approvedTickets: 0,
        rejectedTickets: 0
      });

      // Load departments
      try {
        const depsResponse = await departmentService.getAllDepartments();
        const depsData = depsResponse.data;
        setDepartments(Array.isArray(depsData) ? depsData : []);
        console.log('Departments loaded:', depsData);
      } catch (deptError) {
        console.error('Error loading departments:', deptError);
        setDepartments([]);
      }

      // Load form templates
      try {
        const templatesData = await formTemplateService.getAllFormTemplates();
        setFormTemplates(Array.isArray(templatesData) ? templatesData : []);
        console.log('Form templates loaded:', templatesData);
      } catch (templateError) {
        console.error('Error loading form templates:', templateError);
        setFormTemplates([]);
      }
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      // Set empty arrays on error to prevent crashes
      setStats({
        pendingTickets: 0,
        processedTickets: 0,
        approvedTickets: 0,
        rejectedTickets: 0
      });
      setDepartments([]);
      setFormTemplates([]);
    }
  };

  const loadPendingTickets = async () => {
    if (!currentApproverId) {
      console.error('No user ID found, cannot load pending tickets');
      setPendingTickets([]);
      return;
    }

    setLoading(true);
    try {
      const response = await approvalService.getPendingTickets(
        filters, 
        pendingPagination.current - 1, 
        pendingPagination.pageSize,
        currentApproverId
      );
      
      console.log('🔍 Pending tickets response:', response);
      console.log('🔍 Response structure:', Object.keys(response));
      console.log('🔍 Content:', response.content);
      console.log('🔍 Array check:', Array.isArray(response.content));
      
      setPendingTickets(response.content || []);
      setPendingPagination(prev => ({
        ...prev,
        total: response.totalElements || 0
      }));
    } catch (error) {
      console.error('Error loading pending tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProcessedTickets = async () => {
    if (!currentApproverId) {
      console.error('No user ID found, cannot load processed tickets');
      setProcessedTickets([]);
      return;
    }

    setLoading(true);
    try {
      const response = await approvalService.getProcessedTickets(
        filters, 
        processedPagination.current - 1, 
        processedPagination.pageSize,
        currentApproverId
      );
      
      setProcessedTickets(response.content || []);
      setProcessedPagination(prev => ({
        ...prev,
        total: response.totalElements || 0
      }));
    } catch (error) {
      console.error('Error loading processed tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Reset pagination when filters change
    if (activeTab === 'pending') {
      setPendingPagination(prev => ({ ...prev, current: 1 }));
    } else {
      setProcessedPagination(prev => ({ ...prev, current: 1 }));
    }
  };

  const handleSearch = (value) => {
    handleFilterChange('q', value);
  };

  const resetFilters = () => {
    setFilters({
      departmentId: null,
      formTemplateId: null,
      priority: null,
      employeeCode: '',
      q: '',
      sort: 'createdAt,desc'
    });
  };

  const showModal = (action, ticketId, taskId = null) => {
    setModalState({
      visible: true,
      action,
      ticketId,
      taskId
    });
  };

  const hideModal = () => {
    setModalState({
      visible: false,
      action: 'view',
      ticketId: null,
      taskId: null
    });
  };

  const handleModalSuccess = () => {
    // Reload data after successful action
    loadInitialData();
    if (activeTab === 'pending') {
      loadPendingTickets();
    } else {
      loadProcessedTickets();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStatsCards = () => {
    const statsData = [
      {
        title: "Chờ duyệt",
        value: stats.pendingTickets || 0,
        icon: <MdApproval className="h-6 w-6" />,
        color: "bg-yellow-500"
      },
      {
        title: "Đã xử lý",
        value: stats.processedTickets || 0,
        icon: <MdAssignment className="h-6 w-6" />,
        color: "bg-blue-500"
      },
      {
        title: "Đã duyệt",
        value: stats.approvedTickets || 0,
        icon: <MdCheckCircle className="h-6 w-6" />,
        color: "bg-green-500"
      },
      {
        title: "Từ chối",
        value: stats.rejectedTickets || 0,
        icon: <MdPriorityHigh className="h-6 w-6" />,
        color: "bg-red-500"
      }
    ];

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-4 rounded-xl text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFilters = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <MdFilterList className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
        </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <FormControl fullWidth size="small">
          <InputLabel>Phòng ban</InputLabel>
          <Select
            value={filters.departmentId || ''}
            onChange={(e) => handleFilterChange('departmentId', e.target.value || null)}
            label="Phòng ban"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {departments && departments.map(dept => (
              <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Loại yêu cầu</InputLabel>
          <Select
            value={filters.formTemplateId || ''}
            onChange={(e) => handleFilterChange('formTemplateId', e.target.value || null)}
            label="Loại yêu cầu"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {formTemplates && formTemplates.map(template => (
              <MenuItem key={template.id} value={template.id}>{template.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Mức ưu tiên</InputLabel>
          <Select
            value={filters.priority || ''}
            onChange={(e) => handleFilterChange('priority', e.target.value || null)}
            label="Mức ưu tiên"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="HIGH">Cao</MenuItem>
            <MenuItem value="MEDIUM">Trung bình</MenuItem>
            <MenuItem value="LOW">Thấp</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Mã nhân viên"
          value={filters.employeeCode}
          onChange={(e) => handleFilterChange('employeeCode', e.target.value)}
          fullWidth
        />

        <FormControl fullWidth size="small">
          <InputLabel>Sắp xếp</InputLabel>
          <Select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            label="Sắp xếp"
          >
                          <MenuItem value="createdAt,desc">Mới nhất</MenuItem>
              <MenuItem value="createdAt,asc">Cũ nhất</MenuItem>
            <MenuItem value="ticket.priority.name,desc">Ưu tiên cao</MenuItem>
            <MenuItem value="ticket.priority.name,asc">Ưu tiên thấp</MenuItem>
          </Select>
        </FormControl>

        <Button 
          variant="outlined"
          onClick={resetFilters}
          fullWidth
          sx={{ height: '40px' }}
        >
          Đặt lại
        </Button>
                  </div>

      <div className="mt-4">
        <TextField
          fullWidth
          size="small"
          label="Tìm kiếm theo mã ticket, tiêu đề..."
          value={filters.q}
          onChange={(e) => handleFilterChange('q', e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch(e.target.value);
            }
          }}
          InputProps={{
            endAdornment: (
              <MdSearch 
                className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => handleSearch(filters.q)}
              />
            )
          }}
        />
                  </div>
                </div>
  );

  const renderTicketTable = (tickets, showActions = true) => (
    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f9fafb' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Mã NV</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Tên NV</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Phòng ban</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Loại ticket</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Ngày gửi</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Hạn xử lý</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Mức ưu tiên</TableCell>
            {!showActions && <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>}
            <TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket, index) => (
            <TableRow key={ticket.id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
              <TableCell>{(pendingPagination.current - 1) * pendingPagination.pageSize + index + 1}</TableCell>
              <TableCell>{ticket.ticket?.requester?.employeeCode || ticket.requester?.employeeCode}</TableCell>
              <TableCell>{ticket.ticket?.requester?.fullName || ticket.requester?.fullName}</TableCell>
              <TableCell>{ticket.ticket?.department?.name || ticket.department?.name}</TableCell>
              <TableCell>{ticket.ticket?.formTemplate?.name || ticket.formTemplate?.name}</TableCell>
              <TableCell>{formatDate(ticket.ticket?.createdAt || ticket.createdAt)}</TableCell>
              <TableCell>{formatDate(ticket.ticket?.dueDate || ticket.dueDate)}</TableCell>
              <TableCell>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.ticket?.priority?.name || ticket.priority?.name)}`}>
                  {ticket.ticket?.priority?.name || ticket.priority?.name}
                </span>
              </TableCell>
              {!showActions && (
                <TableCell>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.action)}`}>
                    {ticket.action === 'APPROVE' ? 'Đã duyệt' : 
                     ticket.action === 'REJECT' ? 'Từ chối' : 'Chờ xử lý'}
                  </span>
                </TableCell>
              )}
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<MdVisibility />}
                    onClick={() => showModal('view', ticket.ticket?.id || ticket.id)}
                    sx={{ 
                      color: '#1976d2',
                      borderColor: '#1976d2',
                      '&:hover': { borderColor: '#1565c0', backgroundColor: '#f3f4f6' }
                    }}
                  >
                    Chi tiết
                  </Button>
                  {showActions && (
                    <>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<MdCheckCircle />}
                        onClick={() => showModal('approve', ticket.ticket?.id || ticket.id, ticket.id)}
                        sx={{ 
                          backgroundColor: '#4caf50', 
                          '&:hover': { backgroundColor: '#45a049' }
                        }}
                      >
                        Duyệt
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<MdPriorityHigh />}
                        onClick={() => showModal('reject', ticket.ticket?.id || ticket.id, ticket.id)}
                        sx={{ 
                          backgroundColor: '#f44336', 
                          '&:hover': { backgroundColor: '#da190b' }
                        }}
                      >
                        Từ chối
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý duyệt ticket</h1>
          <p className="text-gray-600 text-lg">Duyệt và quản lý các yêu cầu hỗ trợ</p>
              </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MdSchedule className="h-4 w-4" />
          <span>Cập nhật cuối: {new Date().toLocaleString('vi-VN')}</span>
        </div>
      </div>

      {/* Stats */}
      {renderStatsCards()}

      {/* Filters */}
      {renderFilters()}

      {/* Tickets Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Tabs 
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
          >
            <Tab 
              label={`Chờ duyệt (${pendingPagination.total})`} 
              value="pending"
            />
            <Tab 
              label={`Đã xử lý (${processedPagination.total})`} 
              value="processed"
            />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {activeTab === 'pending' && (
            <>
              {loading ? (
                <div className="flex justify-center py-12">
                  <CircularProgress />
                </div>
                             ) : pendingTickets && pendingTickets.length > 0 ? (
                 <>
                   <div className="mb-6">
                     {renderTicketTable(pendingTickets, true)}
            </div>
                  <div className="flex justify-center">
                    <Pagination
                      count={Math.ceil(pendingPagination.total / pendingPagination.pageSize)}
                      page={pendingPagination.current}
                      onChange={(e, page) => setPendingPagination(prev => ({ ...prev, current: page }))}
                      color="primary"
                      size="large"
                    />
          </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <MdAssignment className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Không có ticket nào cần duyệt</p>
        </div>
              )}
            </>
          )}

          {activeTab === 'processed' && (
            <>
              {loading ? (
                <div className="flex justify-center py-12">
                  <CircularProgress />
                </div>
                             ) : processedTickets && processedTickets.length > 0 ? (
                 <>
                   <div className="mb-6">
                     {renderTicketTable(processedTickets, false)}
                   </div>
                  <div className="flex justify-center">
                    <Pagination
                      count={Math.ceil(processedPagination.total / processedPagination.pageSize)}
                      page={processedPagination.current}
                      onChange={(e, page) => setProcessedPagination(prev => ({ ...prev, current: page }))}
                      color="primary"
                      size="large"
                    />
            </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <MdCheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có ticket nào được xử lý</p>
          </div>
              )}
            </>
          )}
        </Box>
        </div>

      {/* Action Modal */}
      <TicketActionModal
        visible={modalState.visible}
        onClose={hideModal}
        ticketId={modalState.ticketId}
        taskId={modalState.taskId}
        action={modalState.action}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
