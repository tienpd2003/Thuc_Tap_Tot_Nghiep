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
    code: '',
    description: '',
    managerId: null,
    maxEmployees: '',
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
            code: department.code || '',
            description: department.description || '',
            managerId: department.managerId || null,
            maxEmployees: department.maxEmployees || '',
            active: department.active !== false
          });
          
          dispatch(setSelectedDepartment(department));
        } catch (error) {
          console.error('Error loading department:', error);
          dispatch(setError('Không thể tải thông tin phòng ban'));
        }
      };

      loadDepartment();
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

    if (!formData.code.trim()) {
      errors.code = 'Mã phòng ban là bắt buộc';
    } else if (!/^[A-Z0-9_]+$/.test(formData.code)) {
      errors.code = 'Mã phòng ban chỉ được chứa chữ in hoa, số và dấu gạch dưới';
    }

    if (formData.maxEmployees && formData.maxEmployees < 1) {
      errors.maxEmployees = 'Số lượng nhân viên tối đa phải lớn hơn 0';
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
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        managerId: formData.managerId,
        maxEmployees: formData.maxEmployees ? parseInt(formData.maxEmployees) : null,
        active: formData.active
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
    }
  };

  // Get manager options (exclude current manager if editing)
  const availableManagers = users.filter(user => 
    user.active && 
    (!isEdit || user.id !== selectedDepartment?.managerId) &&
    user.role !== 'ADMIN' // Assuming admins shouldn't be department managers
  );

  const selectedManager = users.find(user => user.id === formData.managerId);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {isEdit ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? `Cập nhật thông tin phòng ban "${selectedDepartment?.name}"` : 'Tạo phòng ban mới cho tổ chức'}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(ROUTES.ADMIN.DEPARTMENTS.LIST)}
        >
          Quay lại
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(setError(null))}>
          {error}
        </Alert>
      )}

      {/* Form */}
      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon color="primary" />
                Thông tin cơ bản
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên phòng ban *"
                placeholder="Nhập tên phòng ban"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mã phòng ban *"
                placeholder="VD: IT, HR, FINANCE"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                error={Boolean(formErrors.code)}
                helperText={formErrors.code || 'Chỉ được chứa chữ in hoa, số và dấu gạch dưới'}
                disabled={loading || (isEdit && selectedDepartment?.code)}
                InputProps={{
                  style: { textTransform: 'uppercase' }
                }}
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

            {/* Management Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Thông tin quản lý
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                fullWidth
                options={availableManagers}
                getOptionLabel={(option) => `${option.fullName} (${option.employeeCode})`}
                value={selectedManager || null}
                onChange={(event, newValue) => handleInputChange('managerId', newValue?.id || null)}
                disabled={loading || loadingUsers}
                loading={loadingUsers}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Trưởng phòng"
                    placeholder="Chọn trưởng phòng"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingUsers ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
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
                noOptionsText="Không tìm thấy nhân viên phù hợp"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số lượng nhân viên tối đa"
                placeholder="Nhập số lượng (để trống nếu không giới hạn)"
                value={formData.maxEmployees}
                onChange={(e) => handleInputChange('maxEmployees', e.target.value)}
                type="number"
                error={Boolean(formErrors.maxEmployees)}
                helperText={formErrors.maxEmployees || 'Để trống nếu không giới hạn số lượng'}
                disabled={loading}
                InputProps={{
                  inputProps: { min: 1 }
                }}
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Trạng thái
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={(e) => handleInputChange('active', e.target.checked)}
                    disabled={loading}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">
                      Trạng thái hoạt động
                    </Typography>
                    <Chip
                      label={formData.active ? 'Hoạt động' : 'Ngưng hoạt động'}
                      color={formData.active ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                }
              />
            </Grid>

            {/* Current Department Info (for editing) */}
            {isEdit && selectedDepartment && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Thông tin hiện tại
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Số nhân viên hiện tại:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedDepartment.employeeCount || 0} người
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Trưởng phòng hiện tại:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedDepartment.managerName || 'Chưa có'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Ngày tạo:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedDepartment.createdAt 
                            ? new Date(selectedDepartment.createdAt).toLocaleDateString('vi-VN')
                            : 'N/A'
                          }
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </>
            )}

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(ROUTES.ADMIN.DEPARTMENTS.LIST)}
                  disabled={loading}
                  size="large"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                  size="large"
                >
                  {loading ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Tạo mới')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default DepartmentForm;
