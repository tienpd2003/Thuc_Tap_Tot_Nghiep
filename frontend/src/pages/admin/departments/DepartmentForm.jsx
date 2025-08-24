import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Alert,
  FormControlLabel,
  Switch,
  Autocomplete,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '../../../constants';
import { departmentService, userService } from '../../../services';
import {
  setLoading,
  setError,
  addDepartment,
  updateDepartment,
  setSelectedDepartment
} from '../../../store/slices/departmentSlice';

const DepartmentForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { loading, error, selectedDepartment } = useSelector(state => state.departments);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    departmentHeadId: null,
    active: true
  });

  const [formErrors, setFormErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Load users for manager selection
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await userService.getAllUsers();
        console.log('All users loaded:', response.data);
        setUsers(response.data || []);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  // Load department data for editing
  useEffect(() => {
    if (isEdit && id) {
      const loadDepartment = async () => {
        try {
          dispatch(setLoading(true));
          const response = await departmentService.getDepartmentById(id);
          const department = response.data;
          
          setFormData({
            name: department.name || '',
            description: department.description || '',
            departmentHeadId: department.departmentHeadId || null,
            active: department.isActive !== false // Backend uses 'isActive', frontend uses 'active'
          });
          
          dispatch(setSelectedDepartment(department));
        } catch (error) {
          console.error('Error loading department:', error);
          dispatch(setError('Không thể tải thông tin phòng ban'));
        } finally {
          dispatch(setLoading(false));
        }
      };

      loadDepartment();
    } else {
      // For create mode, ensure loading is false
      dispatch(setLoading(false));
    }
  }, [isEdit, id, dispatch]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Tên phòng ban là bắt buộc';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const departmentData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        departmentHeadId: formData.departmentHeadId,
        isActive: formData.active // Backend expects 'isActive', frontend uses 'active'
      };

      let result;
      if (isEdit) {
        result = await departmentService.updateDepartment(id, departmentData);
        dispatch(updateDepartment(result.data));
      } else {
        result = await departmentService.createDepartment(departmentData);
        dispatch(addDepartment(result.data));
      }

      navigate(ROUTES.ADMIN.DEPARTMENTS.LIST);
    } catch (error) {
      console.error('Save error:', error);
      
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('code already exists')) {
          setFormErrors({ code: 'Mã phòng ban đã tồn tại' });
        } else if (error.response.data.message.includes('name already exists')) {
          setFormErrors({ name: 'Tên phòng ban đã tồn tại' });
        } else {
          dispatch(setError(error.response.data.message));
        }
      } else {
        dispatch(setError(isEdit ? 'Không thể cập nhật phòng ban' : 'Không thể tạo phòng ban'));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Get department head options (only APPROVER role users)
  const availableManagers = users.filter(user => {
    const isActive = user.active || user.isActive;
    // Temporarily remove role filter to debug
    // const isApprover = user.roleName === 'APPROVER';
    const isNotCurrentHead = !isEdit || user.id !== selectedDepartment?.departmentHeadId;
    
    console.log(`User ${user.fullName}: active=${isActive}, roleName=${user.roleName}, isNotCurrentHead=${isNotCurrentHead}`);
    
    return isActive && isNotCurrentHead; // Removed role filter temporarily
  });
  
  console.log('Available managers after filtering:', availableManagers);

  const selectedManager = users.find(user => user.id === formData.departmentHeadId);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {isEdit ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              {isEdit ? `Cập nhật thông tin phòng ban "${selectedDepartment?.name}"` : 'Tạo phòng ban mới cho tổ chức'}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(ROUTES.ADMIN.DEPARTMENTS.LIST)}
            sx={{ minWidth: 120 }}
          >
            Quay lại
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(setError(null))}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Form */}
      <Paper elevation={2} sx={{ overflow: 'hidden' }}>
        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <Box sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.light',
              pb: 1,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <BusinessIcon />
              Thông tin cơ bản
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên phòng ban *"
                  placeholder="Nhập tên phòng ban"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={Boolean(formErrors.name)}
                  helperText={formErrors.name}
                  disabled={loading}
                  required
                  sx={{ '& .MuiInputBase-root': { height: 56 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  placeholder="Nhập mô tả về vai trò và chức năng của phòng ban"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  multiline
                  rows={3}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.active}
                      onChange={(e) => handleInputChange('active', e.target.checked)}
                      disabled={loading}
                      color="primary"
                    />
                  }
                  label="Phòng ban đang hoạt động"
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Manager Assignment Section */}
          <Box sx={{ p: 4, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.light',
              pb: 1,
              mb: 3
            }}>
              Thông tin quản lý
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  options={availableManagers}
                  getOptionLabel={(option) => `${option.fullName} (${option.employeeCode})`}
                  value={selectedManager || null}
                  onChange={(event, newValue) => handleInputChange('departmentHeadId', newValue?.id || null)}
                  disabled={loading || loadingUsers}
                  loading={loadingUsers}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Trưởng phòng"
                      placeholder="Chọn trưởng phòng"
                      helperText="Chỉ người dùng có vai trò 'APPROVER' mới có thể làm trưởng phòng"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingUsers ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      sx={{ '& .MuiInputBase-root': { minHeight: 56 } }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {option.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.employeeCode} - {option.email}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  noOptionsText="Không có người dùng nào có vai trò 'APPROVER' để chọn làm trưởng phòng"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Current Department Info (for editing) */}
          {isEdit && selectedDepartment && (
            <Box sx={{ p: 4, bgcolor: 'primary.50', borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                borderBottom: '2px solid',
                borderColor: 'primary.light',
                pb: 1,
                mb: 3
              }}>
                Thông tin hiện tại
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'primary.light', 
                    borderRadius: 1,
                    bgcolor: 'white'
                  }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Số nhân viên hiện tại:
                    </Typography>
                    <Typography variant="h6" color="primary.main" fontWeight="bold">
                      {selectedDepartment.userCount || 0} người
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'primary.light', 
                    borderRadius: 1,
                    bgcolor: 'white'
                  }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Trưởng phòng hiện tại:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedDepartment.departmentHeadName || 'Chưa có'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'primary.light', 
                    borderRadius: 1,
                    bgcolor: 'white'
                  }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Ngày tạo:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedDepartment.createdAt 
                        ? new Date(selectedDepartment.createdAt).toLocaleDateString('vi-VN')
                        : 'N/A'
                      }
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ p: 4, bgcolor: 'grey.50', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(ROUTES.ADMIN.DEPARTMENTS.LIST)}
              disabled={loading}
              size="large"
              sx={{ minWidth: 120, height: 48 }}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loading}
              size="large"
              sx={{ minWidth: 140, height: 48 }}
            >
              {loading ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default DepartmentForm;
