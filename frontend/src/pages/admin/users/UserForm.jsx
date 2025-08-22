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

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    
    // For select fields (department/role), ensure we store the value correctly
    let finalValue = value;
    if (field === 'departmentId' || field === 'roleId') {
      finalValue = value === '' ? '' : value; // Keep as string for form, will convert to number on submit
    }
    
    setFormData(prev => ({ ...prev, [field]: finalValue }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear general error message when user makes changes
    dispatch(clearError());
  };

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
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? `Cập nhật thông tin người dùng #${id}` : 'Tạo tài khoản người dùng mới trong hệ thống'}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(ROUTES.ADMIN.USERS.LIST)}
        >
          Quay lại
        </Button>
      </Box>

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thông tin cơ bản
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Mã nhân viên *"
                      value={formData.employeeCode}
                      onChange={handleInputChange('employeeCode')}
                      error={!!errors.employeeCode}
                      helperText={errors.employeeCode}
                      disabled={isEdit} // Cannot edit employee code
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Tên đăng nhập *"
                      value={formData.username}
                      onChange={handleInputChange('username')}
                      error={!!errors.username}
                      helperText={errors.username}
                      disabled={isEdit} // Cannot edit username
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={isEdit ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu *'}
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      error={!!errors.password}
                      helperText={errors.password}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Họ và tên *"
                      value={formData.fullName}
                      onChange={handleInputChange('fullName')}
                      error={!!errors.fullName}
                      helperText={errors.fullName}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email *"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      value={formData.phone}
                      onChange={handleInputChange('phone')}
                      error={!!errors.phone}
                      helperText={errors.phone}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Organization Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thông tin tổ chức
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Phòng ban *"
                      value={formData.departmentId}
                      onChange={handleInputChange('departmentId')}
                      error={!!errors.departmentId}
                      helperText={errors.departmentId}
                    >
                      <MenuItem value="">Chọn phòng ban</MenuItem>
                      {departments.map((dept) => (
                        <MenuItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Vai trò *"
                      value={formData.roleId}
                      onChange={handleInputChange('roleId')}
                      error={!!errors.roleId}
                      helperText={errors.roleId}
                    >
                      <MenuItem value="">Chọn vai trò</MenuItem>
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {isEdit && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        fullWidth
                        label="Trạng thái"
                        value={formData.isActive}
                        onChange={handleInputChange('isActive')}
                      >
                        <MenuItem value={true}>Hoạt động</MenuItem>
                        <MenuItem value={false}>Vô hiệu hóa</MenuItem>
                      </TextField>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(ROUTES.ADMIN.USERS.LIST)}
                disabled={submitLoading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={submitLoading ? <CircularProgress size={16} /> : <SaveIcon />}
                disabled={submitLoading}
              >
                {submitLoading ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Tạo mới')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default UserForm;
