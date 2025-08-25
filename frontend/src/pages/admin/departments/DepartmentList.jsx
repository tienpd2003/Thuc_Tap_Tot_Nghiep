import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Checkbox,
  Toolbar,
  MenuItem,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Alert,
  Collapse,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  PowerSettingsNew as DeactivateIcon,
  ChecklistRtl as BulkIcon,
  FileDownload as ExportIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '../../../constants';
import { departmentService } from '../../../services';
import {
  setDepartments,
  setLoading,
  setError,
  setPagination,
  removeDepartment,
  updateDepartment
} from '../../../store/slices/departmentSlice';

const DepartmentList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { departments, loading, error, pagination } = useSelector(state => state.departments);
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [bulkActionsMenu, setBulkActionsMenu] = useState(null);
  const [exportMenu, setExportMenu] = useState(null);
  const [bulkOperationDialog, setBulkOperationDialog] = useState({
    open: false,
    type: '',
    title: '',
    message: '',
    data: null
  });
  const [statusFilter, setStatusFilter] = useState('all');
  // const [showFilters, setShowFilters] = useState(false);

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await departmentService.getAllDepartments();
      dispatch(setDepartments(response.data || []));
    } catch (error) {
      console.error('Error fetching departments:', error);
      dispatch(setError('Không thể tải danh sách phòng ban'));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Filter departments
  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = searchQuery === '' || 
      dept.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.departmentHeadName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && dept.isActive) ||
      (statusFilter === 'inactive' && !dept.isActive);
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const paginatedDepartments = filteredDepartments.slice(
    pagination.page * pagination.pageSize,
    (pagination.page + 1) * pagination.pageSize
  );

  // Handle search
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    dispatch(setPagination({ page: 0 }));
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    dispatch(setPagination({ page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    dispatch(setPagination({ page: 0, pageSize: newPageSize }));
  };

  // Handle department selection
  const handleSelectDepartment = (departmentId) => {
    setSelectedDepartments(prev => 
      prev.includes(departmentId)
        ? prev.filter(id => id !== departmentId)
        : [...prev, departmentId]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedDepartments(paginatedDepartments.map(dept => dept.id));
    } else {
      setSelectedDepartments([]);
    }
  };

  // Export functions
  const exportToCSV = (exportType) => {
    const dataToExport = exportType === 'current' ? paginatedDepartments : filteredDepartments;
    
    const headers = ['STT', 'Tên phòng ban', 'Mô tả', 'Trưởng phòng', 'Số nhân viên', 'Trạng thái'];
    const csvContent = [
      '\uFEFF' + headers.join(','), // UTF-8 BOM for Vietnamese characters
      ...dataToExport.map((dept, index) => [
        exportType === 'current' ? pagination.page * pagination.pageSize + index + 1 : index + 1,
        `"${dept.name || ''}"`,
        `"${dept.description || ''}"`,
        `"${dept.departmentHeadName || 'Chưa có'}"`,
        dept.userCount || 0,
        dept.isActive ? 'Hoạt động' : 'Ngưng hoạt động'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `danh-sach-phong-ban-${exportType}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToPDF = (exportType) => {
    const dataToExport = exportType === 'current' ? paginatedDepartments : filteredDepartments;
    
    const printWindow = window.open('', '_blank');
    const printContent = `
      <html>
        <head>
          <title>Danh sách phòng ban</title>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .status-active { color: green; }
            .status-inactive { color: red; }
          </style>
        </head>
        <body>
          <h1>Danh sách phòng ban</h1>
          <p>Xuất ngày: ${new Date().toLocaleDateString('vi-VN')}</p>
          <p>Tổng số: ${dataToExport.length} phòng ban</p>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên phòng ban</th>
                <th>Mô tả</th>
                <th>Trưởng phòng</th>
                <th>Số nhân viên</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              ${dataToExport.map((dept, index) => `
                <tr>
                  <td>${exportType === 'current' ? pagination.page * pagination.pageSize + index + 1 : index + 1}</td>
                  <td>${dept.name || ''}</td>
                  <td>${dept.description || ''}</td>
                  <td>${dept.departmentHeadName || 'Chưa có'}</td>
                  <td>${dept.userCount || 0}</td>
                  <td class="status-${dept.isActive ? 'active' : 'inactive'}">
                    ${dept.isActive ? 'Hoạt động' : 'Ngưng hoạt động'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    setBulkActionsMenu(null);
    
    const selectedDeptObjects = departments.filter(dept => selectedDepartments.includes(dept.id));
    
    let title, message;
    switch (action) {
      case 'deactivate':
        title = 'Xác nhận ngưng hoạt động';
        message = `Bạn có chắc chắn muốn ngưng hoạt động ${selectedDepartments.length} phòng ban đã chọn?`;
        break;
      case 'activate':
        title = 'Xác nhận kích hoạt';
        message = `Bạn có chắc chắn muốn kích hoạt ${selectedDepartments.length} phòng ban đã chọn?`;
        break;
      case 'delete':
        title = 'Xác nhận xóa';
        message = `Bạn có chắc chắn muốn xóa ${selectedDepartments.length} phòng ban đã chọn? Hành động này không thể hoàn tác.`;
        break;
      default:
        return;
    }
    
    setBulkOperationDialog({
      open: true,
      type: action,
      title,
      message,
      data: selectedDeptObjects
    });
  };

  const executeBulkOperation = async () => {
    const { type, data } = bulkOperationDialog;
    
    try {
      dispatch(setLoading(true));
      
      const promises = data.map(async (dept) => {
        switch (type) {
          case 'deactivate':
            await departmentService.deactivateDepartment(dept.id);
            return { ...dept, isActive: false };
          case 'activate':
            await departmentService.updateDepartment(dept.id, { ...dept, isActive: true });
            return { ...dept, isActive: true };
          case 'delete':
            await departmentService.deleteDepartment(dept.id);
            return dept.id;
          default:
            return dept;
        }
      });
      
      const results = await Promise.all(promises);
      
      if (type === 'delete') {
        results.forEach(deptId => {
          dispatch(removeDepartment(deptId));
        });
      } else {
        results.forEach(updatedDept => {
          dispatch(updateDepartment(updatedDept));
        });
      }
      
      setSelectedDepartments([]);
      setBulkOperationDialog({ open: false, type: '', title: '', message: '', data: null });
      
    } catch (error) {
      console.error('Bulk operation error:', error);
      dispatch(setError('Có lỗi xảy ra khi thực hiện thao tác hàng loạt'));
    }
  };

  // Handle individual actions
  const handleEdit = (department) => {
    navigate(ROUTES.ADMIN.DEPARTMENTS.EDIT(department.id));
  };

  const handleDelete = async (department) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa phòng ban "${department.name}"?`)) {
      try {
        await departmentService.deleteDepartment(department.id);
        dispatch(removeDepartment(department.id));
      } catch (error) {
        console.error('Delete error:', error);
        dispatch(setError('Không thể xóa phòng ban'));
      }
    }
  };

  const handleToggleStatus = async (department) => {
    try {
      if (department.isActive) {
        await departmentService.deactivateDepartment(department.id);
        dispatch(updateDepartment({ ...department, isActive: false }));
      } else {
        await departmentService.updateDepartment(department.id, { ...department, isActive: true });
        dispatch(updateDepartment({ ...department, isActive: true }));
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      dispatch(setError('Không thể thay đổi trạng thái phòng ban'));
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Quản lý phòng ban
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Danh sách và quản lý các phòng ban trong tổ chức
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Export Menu */}
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={(e) => setExportMenu(e.currentTarget)}
          >
            Xuất dữ liệu
          </Button>
          <Menu
            anchorEl={exportMenu}
            open={Boolean(exportMenu)}
            onClose={() => setExportMenu(null)}
          >
            <MenuItem onClick={() => { exportToCSV('current'); setExportMenu(null); }}>
              CSV - Trang hiện tại ({paginatedDepartments.length} phòng ban)
            </MenuItem>
            <MenuItem onClick={() => { exportToCSV('all'); setExportMenu(null); }}>
              CSV - Tất cả ({filteredDepartments.length} phòng ban)
            </MenuItem>
            <MenuItem onClick={() => { exportToPDF('current'); setExportMenu(null); }}>
              PDF - Trang hiện tại ({paginatedDepartments.length} phòng ban)
            </MenuItem>
            <MenuItem onClick={() => { exportToPDF('all'); setExportMenu(null); }}>
              PDF - Tất cả ({filteredDepartments.length} phòng ban)
            </MenuItem>
          </Menu>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(ROUTES.ADMIN.DEPARTMENTS.CREATE)}
            size="large"
          >
            Thêm phòng ban
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(setError(null))}>
          {error}
        </Alert>
      )}

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm theo tên phòng ban, mô tả, trưởng phòng..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Trạng thái"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="active">Hoạt động</MenuItem>
              <MenuItem value="inactive">Ngưng hoạt động</MenuItem>
            </TextField>
          </Grid>
          {/* <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              fullWidth
            >
              Bộ lọc
            </Button>
          </Grid> */}
        </Grid>

        {/* Advanced Filters */}
        {/* <Collapse in={showFilters}>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Bộ lọc nâng cao
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Tổng số phòng ban: {departments.length}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Đang hoạt động: {departments.filter(d => d.isActive).length}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Ngưng hoạt động: {departments.filter(d => !d.isActive).length}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Collapse> */}
      </Paper>

      {/* Bulk Actions Toolbar */}
      {selectedDepartments.length > 0 && (
        <Paper sx={{ mb: 3 }}>
          <Toolbar sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Typography variant="h6" sx={{ flex: '1 1 100%' }}>
              Đã chọn {selectedDepartments.length} phòng ban
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                startIcon={<BulkIcon />}
                onClick={(e) => setBulkActionsMenu(e.currentTarget)}
              >
                Thao tác hàng loạt
              </Button>
              <Menu
                anchorEl={bulkActionsMenu}
                open={Boolean(bulkActionsMenu)}
                onClose={() => setBulkActionsMenu(null)}
              >
                <MenuItem onClick={() => handleBulkAction('activate')}>
                  Kích hoạt phòng ban
                </MenuItem>
                <MenuItem onClick={() => handleBulkAction('deactivate')}>
                  Ngưng hoạt động
                </MenuItem>
                <MenuItem onClick={() => handleBulkAction('delete')}>
                  Xóa phòng ban
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Paper>
      )}

      {/* Department Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedDepartments.length > 0 && selectedDepartments.length < paginatedDepartments.length}
                    checked={paginatedDepartments.length > 0 && selectedDepartments.length === paginatedDepartments.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>STT</TableCell>
                <TableCell>Tên phòng ban</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Trưởng phòng</TableCell>
                <TableCell>Số nhân viên</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDepartments.map((department, index) => (
                <TableRow key={department.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedDepartments.includes(department.id)}
                      onChange={() => handleSelectDepartment(department.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {pagination.page * pagination.pageSize + index + 1}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {department.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {department.description || 'Chưa có mô tả'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {department.departmentHeadName ? (
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {department.departmentHeadName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {department.departmentHeadEmployeeCode}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Chưa có
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {department.userCount || 0}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={department.isActive ? 'Hoạt động' : 'Ngưng hoạt động'}
                      color={department.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(department)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={department.isActive ? 'Ngưng hoạt động' : 'Kích hoạt'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleStatus(department)}
                          color="warning"
                        >
                          <DeactivateIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(department)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredDepartments.length}
          rowsPerPage={pagination.pageSize}
          page={pagination.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Paper>

      {/* Empty State */}
      {filteredDepartments.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <BusinessIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Không tìm thấy phòng ban nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery || statusFilter !== 'all'
              ? 'Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác'
              : 'Chưa có phòng ban nào được tạo'
            }
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(ROUTES.ADMIN.DEPARTMENTS.CREATE)}
          >
            Thêm phòng ban đầu tiên
          </Button>
        </Paper>
      )}

      {/* Bulk Operation Confirmation Dialog */}
      <Dialog
        open={bulkOperationDialog.open}
        onClose={() => setBulkOperationDialog({ open: false, type: '', title: '', message: '', data: null })}
      >
        <DialogTitle>{bulkOperationDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {bulkOperationDialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setBulkOperationDialog({ open: false, type: '', title: '', message: '', data: null })}
            color="inherit"
          >
            Hủy
          </Button>
          <Button 
            onClick={executeBulkOperation}
            color="error"
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DepartmentList;
