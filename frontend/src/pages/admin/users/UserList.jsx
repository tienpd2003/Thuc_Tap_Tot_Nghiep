import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, Paper, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Chip, IconButton, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, InputAdornment,
  Tooltip, Alert, CircularProgress
} from '@mui/material';
import {
  Add as AddIcon, Search as SearchIcon, Edit as EditIcon,
  Delete as DeleteIcon, PersonOff as DeactivateIcon,
  FilterList as FilterIcon, Refresh as RefreshIcon
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

  // Load users with current filters
  const loadUsers = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      let response;
      if (searchQuery.trim()) {
        response = await userService.searchUsersByName(searchQuery);
      } else {
        response = await userService.getAllUsers();
      }
      
      let filteredUsers = response.data || [];
      
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

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Tìm kiếm theo tên..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          
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
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                      Không tìm thấy người dùng nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id} hover>
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
    </Box>
  );
};

export default UserList;
