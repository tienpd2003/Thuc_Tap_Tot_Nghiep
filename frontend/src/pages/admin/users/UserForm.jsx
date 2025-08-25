import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, Paper, TextField, Grid, MenuItem,
  Alert, CircularProgress, Card, CardContent, Divider
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES, VALIDATION_MESSAGES } from '../../../constants';
import { userService, departmentService } from '../../../services';
import { setError, clearError } from '../../../store/slices/userSlice';

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { error } = useSelector(state => state.users);
  const isEdit = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    employeeCode: '',
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    departmentId: '',
    roleId: '',
    isActive: true
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Load user data for edit mode
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getUserById(id);
      if (response.data) {
        setFormData({
          ...response.data,
          password: '', // Don't load password for security
          departmentId: response.data.departmentId ? response.data.departmentId.toString() : '',
          roleId: response.data.roleId ? response.data.roleId.toString() : ''
        });
      }
    } catch (err) {
      console.error('Error loading user:', err);
      dispatch(setError('Không thể tải thông tin người dùng.'));
    } finally {
      setLoading(false);
    }
  }, [id, dispatch]);

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

  // Load user data when in edit mode
  useEffect(() => {
    if (isEdit) {
      loadUser();
    }
  }, [isEdit, loadUser]);

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.employeeCode.trim()) {
      newErrors.employeeCode = VALIDATION_MESSAGES.REQUIRED;
    }
    if (!formData.username.trim()) {
      newErrors.username = VALIDATION_MESSAGES.REQUIRED;
    }
    if (!isEdit && !formData.password.trim()) {
      newErrors.password = VALIDATION_MESSAGES.REQUIRED;
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = VALIDATION_MESSAGES.REQUIRED;
    }
    if (!formData.email.trim()) {
      newErrors.email = VALIDATION_MESSAGES.REQUIRED;
    }
    if (!formData.departmentId) {
      newErrors.departmentId = VALIDATION_MESSAGES.REQUIRED;
    }
    if (!formData.roleId) {
      newErrors.roleId = VALIDATION_MESSAGES.REQUIRED;
    }

    // Format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Password validation (only for new users or when password is provided)
    if ((!isEdit || formData.password) && formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Phone validation (optional but if provided, should be valid)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitLoading(true);
      dispatch(clearError());

      // Prepare data for submission
      const submitData = { ...formData };
      
      // Convert string IDs to numbers for backend
      if (submitData.departmentId) {
        submitData.departmentId = parseInt(submitData.departmentId);
      }
      if (submitData.roleId) {
        submitData.roleId = parseInt(submitData.roleId);
      }
      
      // For edit mode, don't send password if it's empty
      if (isEdit && !submitData.password) {
        delete submitData.password;
      }

      console.log('Submitting data:', submitData); // Debug log

      if (isEdit) {
        await userService.updateUser(id, submitData);
        setSuccessMessage('Cập nhật thông tin người dùng thành công!');
      } else {
        await userService.createUser(submitData);
        setSuccessMessage('Tạo người dùng mới thành công!');
      }

      // Auto-redirect after success
      setTimeout(() => {
        navigate(ROUTES.ADMIN.USERS.LIST);
      }, 2000);

    } catch (err) {
      console.error('Error saving user:', err);
      
      // Handle validation errors from backend
      if (err.response?.status === 400 && err.response.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach(error => {
          backendErrors[error.field] = error.defaultMessage;
        });
        setErrors(backendErrors);
      } else if (err.response?.status === 409) {
        // Conflict error (duplicate email, username, etc.)
        const errorMessage = err.response.data?.message;
        if (errorMessage) {
          if (errorMessage.includes('employee code') || errorMessage.includes('employeeCode')) {
            setErrors(prev => ({ ...prev, employeeCode: 'Mã nhân viên đã tồn tại trong hệ thống' }));
          } else if (errorMessage.includes('username')) {
            setErrors(prev => ({ ...prev, username: 'Tên đăng nhập đã tồn tại trong hệ thống' }));
          } else if (errorMessage.includes('email')) {
            setErrors(prev => ({ ...prev, email: 'Email đã tồn tại trong hệ thống' }));
          } else {
            dispatch(setError(errorMessage));
          }
        } else {
          dispatch(setError('Dữ liệu bị trùng lặp (email, mã nhân viên hoặc tên đăng nhập).'));
        }
      } else if (err.response?.status === 400) {
        // General validation error
        const errorMessage = err.response.data?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
        dispatch(setError(errorMessage));
      } else {
        dispatch(setError('Có lỗi xảy ra khi lưu thông tin người dùng. Vui lòng thử lại.'));
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              {isEdit ? `Cập nhật thông tin người dùng #${id}` : 'Tạo tài khoản người dùng mới trong hệ thống'}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(ROUTES.ADMIN.USERS.LIST)}
            sx={{ minWidth: 120 }}
          >
            Quay lại
          </Button>
        </Box>

        {/* Success Message */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Form */}
      <Paper elevation={2} sx={{ overflow: 'hidden' }}>
        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                borderBottom: '2px solid',
                borderColor: 'primary.light',
                pb: 1,
                mb: 3
              }}>
                Thông tin cơ bản
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Mã nhân viên *"
                    value={formData.employeeCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeCode: e.target.value }))}
                    error={Boolean(errors.employeeCode)}
                    helperText={errors.employeeCode}
                    disabled={loading || submitLoading || isEdit}
                    required
                    sx={{ '& .MuiInputBase-root': { height: 56 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tên đăng nhập *"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    error={Boolean(errors.username)}
                    helperText={errors.username}
                    disabled={loading || submitLoading || isEdit}
                    required
                    sx={{ '& .MuiInputBase-root': { height: 56 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Họ và tên *"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    error={Boolean(errors.fullName)}
                    helperText={errors.fullName}
                    disabled={loading || submitLoading}
                    required
                    sx={{ '& .MuiInputBase-root': { height: 56 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    disabled={loading || submitLoading}
                    required
                    sx={{ '& .MuiInputBase-root': { height: 56 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    error={Boolean(errors.phone)}
                    helperText={errors.phone}
                    disabled={loading || submitLoading}
                    sx={{ '& .MuiInputBase-root': { height: 56 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={isEdit ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu *"}
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                    disabled={loading || submitLoading}
                    required={!isEdit}
                    sx={{ '& .MuiInputBase-root': { height: 56 } }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Organization Information Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                borderBottom: '2px solid',
                borderColor: 'primary.light',
                pb: 1,
                mb: 3
              }}>
                Thông tin tổ chức
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Phòng ban"
                    value={formData.departmentId}
                    onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                    error={Boolean(errors.departmentId)}
                    helperText={errors.departmentId}
                    disabled={loading || submitLoading}
                    required
                    displayEmpty
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiInputBase-root': { 
                        height: 56,
                        '& .MuiSelect-select': {
                          minHeight: '1.4375em',
                          display: 'flex',
                          alignItems: 'center'
                        }
                      }
                    }}
                    SelectProps={{
                      displayEmpty: true,
                      renderValue: (selected) => {
                        if (!selected) {
                          return <em style={{ color: '#999', fontStyle: 'italic' }}>Chọn phòng ban</em>;
                        }
                        const selectedDept = departments.find(dept => dept.id.toString() === selected);
                        return selectedDept ? selectedDept.name : '';
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>Chọn phòng ban</em>
                    </MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Vai trò"
                    value={formData.roleId}
                    onChange={(e) => setFormData(prev => ({ ...prev, roleId: e.target.value }))}
                    error={Boolean(errors.roleId)}
                    helperText={errors.roleId}
                    disabled={loading || submitLoading}
                    required
                    displayEmpty
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiInputBase-root': { 
                        height: 56,
                        '& .MuiSelect-select': {
                          minHeight: '1.4375em',
                          display: 'flex',
                          alignItems: 'center'
                        }
                      }
                    }}
                    SelectProps={{
                      displayEmpty: true,
                      renderValue: (selected) => {
                        if (!selected) {
                          return <em style={{ color: '#999', fontStyle: 'italic' }}>Chọn vai trò</em>;
                        }
                        const selectedRole = roles.find(role => role.id.toString() === selected);
                        return selectedRole ? selectedRole.name : '';
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>Chọn vai trò</em>
                    </MenuItem>
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Trạng thái"
                    value={formData.isActive.toString()}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                    disabled={loading || submitLoading}
                    sx={{ 
                      '& .MuiInputBase-root': { 
                        height: 56,
                        '& .MuiSelect-select': {
                          minHeight: '1.4375em',
                          display: 'flex',
                          alignItems: 'center'
                        }
                      }
                    }}
                  >
                    <MenuItem value="true">Hoạt động</MenuItem>
                    <MenuItem value="false">Ngưng hoạt động</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ p: 4, bgcolor: 'grey.50', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(ROUTES.ADMIN.USERS.LIST)}
              disabled={submitLoading}
              size="large"
              sx={{ minWidth: 120, height: 48 }}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || submitLoading}
              startIcon={submitLoading ? <CircularProgress size={20} /> : <SaveIcon />}
              size="large"
              sx={{ minWidth: 140, height: 48 }}
            >
              {submitLoading ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default UserForm;
