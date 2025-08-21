import React from 'react';
import { Box, Typography, Button, Paper, TextField, Grid } from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../constants';

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? `Cập nhật thông tin người dùng #${id}` : 'Tạo tài khoản người dùng mới'}
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

      {/* Form */}
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              placeholder="Nhập email"
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phòng ban"
              placeholder="Chọn phòng ban"
              disabled
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                User Form Interface
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Form quản lý người dùng sẽ được triển khai trong PHASE 4.
                <br />
                Bao gồm: validation, role assignment, department selection.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled
                >
                  {isEdit ? 'Cập nhật' : 'Tạo mới'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate(ROUTES.ADMIN.USERS.LIST)}
                >
                  Hủy
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserForm;
