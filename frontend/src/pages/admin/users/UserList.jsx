import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, Paper, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Chip, IconButton, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, InputAdornment,
  Tooltip, Alert, CircularProgress, Checkbox, Menu, 
  FormControl, InputLabel, Select, Toolbar
} from '@mui/material';
import {
  Add as AddIcon, Search as SearchIcon, Edit as EditIcon,
  Delete as DeleteIcon, PersonOff as DeactivateIcon,
  FilterList as FilterIcon, Refresh as RefreshIcon,
  GetApp as ExportIcon, MoreVert as MoreIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES, ROLE_LABELS, TABLE_CONFIG } from '../../../constants';
import { userService } from '../../../services';
import { departmentService } from '../../../services';
import {
  setUsers, setLoading, setError, setSearchQuery, setFilters,
  setPagination, clearError
} from '../../../store/slices/userSlice';

const UserList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { users, loading, error, searchQuery, filters, pagination } = useSelector(state => state.users);
  
  // Local state
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [deactivateDialog, setDeactivateDialog] = useState({ open: false, user: null });
  
  // Bulk operations state
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkActionsMenu, setBulkActionsMenu] = useState(null);
  const [bulkOperationDialog, setBulkOperationDialog] = useState({
    open: false,
    type: '', // 'role', 'department', 'deactivate', 'delete'
    value: null
  });
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);
  
  // Export state
  const [exportMenu, setExportMenu] = useState(null);

  // Enhanced search function for multiple fields
  const searchInMultipleFields = (users, query) => {
    if (!query.trim()) return users;
    
    const searchTerm = query.toLowerCase().trim();
    return users.filter(user => 
      user.fullName?.toLowerCase().includes(searchTerm) ||
      user.employeeCode?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm)
    );
  };

  // Load users with current filters
  const loadUsers = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      // Always get all users first, then apply search and filters
      const response = await userService.getAllUsers();
      let allUsers = response.data || [];
      
      // Apply search across multiple fields
      let filteredUsers = searchInMultipleFields(allUsers, searchQuery);
      
      // Apply filters
      if (filters.department) {
        filteredUsers = filteredUsers.filter(user => user.departmentId?.toString() === filters.department);
      }
      if (filters.role) {
        filteredUsers = filteredUsers.filter(user => user.roleId?.toString() === filters.role);
      }
      if (filters.isActive !== null) {
        filteredUsers = filteredUsers.filter(user => user.isActive === filters.isActive);
      }
      
      dispatch(setUsers(filteredUsers));
      dispatch(setPagination({
        page: 0, // Reset to first page when data changes
        pageSize: pagination.pageSize,
        total: filteredUsers.length
      }));
    } catch (err) {
      console.error('Error loading users:', err);
      dispatch(setError('Không thể tải danh sách người dùng. Vui lòng thử lại.'));
    }
  }, [searchQuery, filters, dispatch, pagination.pageSize]);

  const loadDepartments = async () => {
    try {
      const response = await departmentService.getActiveDepartments();
      setDepartments(response.data || []);
    } catch (err) {
      console.error('Error loading departments:', err);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await userService.getAllRoles();
      setRoles(response.data || []);
    } catch (err) {
      console.error('Error loading roles:', err);
    }
  };

  // Load initial data
  useEffect(() => {
    loadDepartments();
    loadRoles();
  }, []);

  // Load users with current filters
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearchChange = (event) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const handleFilterChange = (filterName, value) => {
    dispatch(setFilters({ [filterName]: value }));
  };

  const handlePageChange = (event, newPage) => {
    dispatch(setPagination({ ...pagination, page: newPage }));
  };

  const handlePageSizeChange = (event) => {
    dispatch(setPagination({ 
      ...pagination, 
      pageSize: parseInt(event.target.value),
      page: 0 
    }));
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(setLoading(true));
      await userService.deleteUser(deleteDialog.user.id);
      setDeleteDialog({ open: false, user: null });
      loadUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      dispatch(setError('Không thể xóa người dùng. Vui lòng thử lại.'));
    }
  };

  const handleDeactivateUser = async () => {
    try {
      dispatch(setLoading(true));
      await userService.deactivateUser(deactivateDialog.user.id);
      setDeactivateDialog({ open: false, user: null });
      loadUsers();
    } catch (err) {
      console.error('Error deactivating user:', err);
      dispatch(setError('Không thể vô hiệu hóa người dùng. Vui lòng thử lại.'));
    }
  };

  // Bulk Operations Handlers
  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(user => user.id));
    }
  };

  const handleBulkAction = (action) => {
    setBulkActionsMenu(null);
    setBulkOperationDialog({
      open: true,
      type: action,
      value: null
    });
  };

  const handleBulkOperationConfirm = async () => {
    setIsProcessingBulk(true);
    try {
      const { type, value } = bulkOperationDialog;
      
      switch (type) {
        case 'role':
          for (const userId of selectedUsers) {
            const user = users.find(u => u.id === userId);
            await userService.updateUser(userId, { ...user, roleId: value });
          }
          break;
        case 'department':
          for (const userId of selectedUsers) {
            const user = users.find(u => u.id === userId);
            await userService.updateUser(userId, { ...user, departmentId: value });
          }
          break;
        case 'deactivate':
          for (const userId of selectedUsers) {
            await userService.deactivateUser(userId);
          }
          break;
        case 'delete':
          for (const userId of selectedUsers) {
            await userService.deleteUser(userId);
          }
          break;
        default:
          break;
      }
      
      setSelectedUsers([]);
      setBulkOperationDialog({ open: false, type: '', value: null });
      loadUsers();
    } catch (err) {
      console.error('Error performing bulk operation:', err);
      dispatch(setError('Không thể thực hiện thao tác hàng loạt. Vui lòng thử lại.'));
    } finally {
      setIsProcessingBulk(false);
    }
  };

  // Export Functions
  const exportToCSV = (exportType = 'current') => {
    const usersToExport = exportType === 'all' ? users : paginatedUsers;
    const csvContent = [
      ['STT', 'Mã NV', 'Họ tên', 'Email', 'Phòng ban', 'Vai trò', 'Trạng thái'].join(','),
      ...usersToExport.map((user, index) => [
        exportType === 'all' ? index + 1 : pagination.page * pagination.pageSize + index + 1,
        user.employeeCode,
        `"${user.fullName}"`, // Wrap in quotes to handle special characters
        user.email,
        `"${getDepartmentName(user.departmentId)}"`, // Wrap in quotes for Vietnamese text
        `"${getRoleLabel(user.roleId)}"`, // Wrap in quotes for Vietnamese text
        user.isActive ? 'Hoạt động' : 'Vô hiệu hóa'
      ].join(','))
    ].join('\n');

    // Add UTF-8 BOM to fix Vietnamese character encoding
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;
    
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      const fileName = exportType === 'all' 
        ? `all_users_${new Date().toISOString().split('T')[0]}.csv`
        : `users_page_${pagination.page + 1}_${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setExportMenu(null);
  };

  const exportToPDF = (exportType = 'current') => {
    const usersToExport = exportType === 'all' ? users : paginatedUsers;
    // Create a simple HTML table for PDF export
    const htmlContent = `
      <html>
        <head>
          <title>Danh sách người dùng</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <h1>Danh sách người dùng ${exportType === 'all' ? '(Tất cả)' : `(Trang ${pagination.page + 1})`}</h1>
          <p>Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</p>
          <p>Tổng số: ${usersToExport.length} người dùng</p>
          <table>
            <tr>
              <th>STT</th>
              <th>Mã NV</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Phòng ban</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
            </tr>
            ${usersToExport.map((user, index) => `
              <tr>
                <td>${exportType === 'all' ? index + 1 : pagination.page * pagination.pageSize + index + 1}</td>
                <td>${user.employeeCode}</td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>${getDepartmentName(user.departmentId)}</td>
                <td>${getRoleLabel(user.roleId)}</td>
                <td>${user.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
    setExportMenu(null);
  };

  const getRoleLabel = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'N/A';
  };

  const getDepartmentName = (departmentId) => {
    const dept = departments.find(d => d.id === departmentId);
    return dept ? dept.name : 'N/A';
  };

  // Paginated users for display
  const paginatedUsers = users.slice(
    pagination.page * pagination.pageSize,
    pagination.page * pagination.pageSize + pagination.pageSize
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Quản lý người dùng
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Danh sách và quản lý tài khoản người dùng trong hệ thống
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={(e) => setExportMenu(e.currentTarget)}
            size="large"
          >
            Xuất dữ liệu
          </Button>
          <Tooltip title="Làm mới danh sách">
            <IconButton onClick={loadUsers} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(ROUTES.ADMIN.USERS.CREATE)}
            size="large"
          >
            Thêm người dùng
          </Button>
        </Box>
      </Box>

      {/* Export Menu */}
      <Menu
        anchorEl={exportMenu}
        open={Boolean(exportMenu)}
        onClose={() => setExportMenu(null)}
      >
        <MenuItem onClick={() => exportToCSV('current')}>
          <ExportIcon sx={{ mr: 1 }} />
          CSV - Trang hiện tại ({paginatedUsers.length} users)
        </MenuItem>
        <MenuItem onClick={() => exportToCSV('all')}>
          <ExportIcon sx={{ mr: 1 }} />
          CSV - Tất cả ({users.length} users)
        </MenuItem>
        <MenuItem onClick={() => exportToPDF('current')}>
          <ExportIcon sx={{ mr: 1 }} />
          PDF - Trang hiện tại ({paginatedUsers.length} users)
        </MenuItem>
        <MenuItem onClick={() => exportToPDF('all')}>
          <ExportIcon sx={{ mr: 1 }} />
          PDF - Tất cả ({users.length} users)
        </MenuItem>
      </Menu>

      {/* Bulk Operations Toolbar */}
      {selectedUsers.length > 0 && (
        <Paper 
          sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: 'primary.50',
            transition: 'all 0.3s ease-in-out',
            transform: 'translateY(0)',
            opacity: 1
          }}
        >
          <Toolbar sx={{ px: 0, minHeight: 'auto' }}>
            <Typography variant="subtitle1" sx={{ flex: 1, color: 'primary.main', fontWeight: 'medium' }}>
              Đã chọn {selectedUsers.length} người dùng
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => setSelectedUsers([])}
              >
                Bỏ chọn
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<MoreIcon />}
                onClick={(e) => setBulkActionsMenu(e.currentTarget)}
                disabled={selectedUsers.length === 0}
              >
                Thao tác hàng loạt
              </Button>
            </Box>
          </Toolbar>
        </Paper>
      )}

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkActionsMenu}
        open={Boolean(bulkActionsMenu)}
        onClose={() => setBulkActionsMenu(null)}
      >
        <MenuItem onClick={() => handleBulkAction('role')}>
          Gán vai trò hàng loạt
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('department')}>
          Chuyển phòng ban hàng loạt
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('deactivate')}>
          Vô hiệu hóa hàng loạt
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('delete')} sx={{ color: 'error.main' }}>
          Xóa hàng loạt
        </MenuItem>
      </Menu>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Tooltip title="Tìm kiếm theo tên, mã nhân viên hoặc email" placement="top">
            <TextField
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 280 }}
            />
          </Tooltip>
          
          <TextField
            select
            label="Phòng ban"
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id.toString()}>
                {dept.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Vai trò"
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id.toString()}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Trạng thái"
            value={filters.isActive === null ? '' : filters.isActive.toString()}
            onChange={(e) => handleFilterChange('isActive', e.target.value === '' ? null : e.target.value === 'true')}
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="true">Hoạt động</MenuItem>
            <MenuItem value="false">Vô hiệu hóa</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {/* Users Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedUsers.length > 0 && selectedUsers.length < paginatedUsers.length}
                    checked={paginatedUsers.length > 0 && selectedUsers.length === paginatedUsers.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell align="center" sx={{ width: 80 }}>#</TableCell>
                <TableCell>Mã NV</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phòng ban</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                      Không tìm thấy người dùng nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user, index) => (
                  <TableRow key={user.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
                      {pagination.page * pagination.pageSize + index + 1}
                    </TableCell>
                    <TableCell>{user.employeeCode}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getDepartmentName(user.departmentId)}</TableCell>
                    <TableCell>{getRoleLabel(user.roleId)}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                        color={user.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            onClick={() => navigate(ROUTES.ADMIN.USERS.EDIT(user.id))}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {user.isActive && (
                          <Tooltip title="Vô hiệu hóa">
                            <IconButton
                              size="small"
                              onClick={() => setDeactivateDialog({ open: true, user })}
                            >
                              <DeactivateIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, user })}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={users.length}
          page={pagination.page}
          onPageChange={handlePageChange}
          rowsPerPage={pagination.pageSize}
          onRowsPerPageChange={handlePageSizeChange}
          rowsPerPageOptions={TABLE_CONFIG.PAGE_SIZE_OPTIONS}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })}>
        <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa người dùng "{deleteDialog.user?.fullName}"? 
            Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })}>Hủy</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <Dialog open={deactivateDialog.open} onClose={() => setDeactivateDialog({ open: false, user: null })}>
        <DialogTitle>Xác nhận vô hiệu hóa người dùng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn vô hiệu hóa người dùng "{deactivateDialog.user?.fullName}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeactivateDialog({ open: false, user: null })}>Hủy</Button>
          <Button onClick={handleDeactivateUser} color="warning" variant="contained">
            Vô hiệu hóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Operation Dialog */}
      <Dialog open={bulkOperationDialog.open} onClose={() => setBulkOperationDialog({ open: false, type: '', value: null })}>
        <DialogTitle>
          {bulkOperationDialog.type === 'role' && 'Gán vai trò hàng loạt'}
          {bulkOperationDialog.type === 'department' && 'Chuyển phòng ban hàng loạt'}
          {bulkOperationDialog.type === 'deactivate' && 'Vô hiệu hóa hàng loạt'}
          {bulkOperationDialog.type === 'delete' && 'Xóa hàng loạt'}
        </DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          {bulkOperationDialog.type === 'role' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={bulkOperationDialog.value || ''}
                onChange={(e) => setBulkOperationDialog(prev => ({ ...prev, value: e.target.value }))}
                label="Vai trò"
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {bulkOperationDialog.type === 'department' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Phòng ban</InputLabel>
              <Select
                value={bulkOperationDialog.value || ''}
                onChange={(e) => setBulkOperationDialog(prev => ({ ...prev, value: e.target.value }))}
                label="Phòng ban"
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {bulkOperationDialog.type === 'deactivate' && (
            <DialogContentText>
              Bạn có chắc chắn muốn vô hiệu hóa {selectedUsers.length} người dùng đã chọn?
            </DialogContentText>
          )}
          {bulkOperationDialog.type === 'delete' && (
            <DialogContentText>
              Bạn có chắc chắn muốn xóa {selectedUsers.length} người dùng đã chọn? 
              Hành động này không thể hoàn tác.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkOperationDialog({ open: false, type: '', value: null })}>
            Hủy
          </Button>
          <Button 
            onClick={handleBulkOperationConfirm} 
            variant="contained"
            color={bulkOperationDialog.type === 'delete' ? 'error' : 'primary'}
            disabled={
              isProcessingBulk || 
              ((bulkOperationDialog.type === 'role' || bulkOperationDialog.type === 'department') && !bulkOperationDialog.value)
            }
          >
            {isProcessingBulk ? <CircularProgress size={20} /> : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;
