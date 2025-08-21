import React from 'react';
import { Box, Typography, Button, Paper, TextField, Grid } from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../constants';

const DepartmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {isEdit ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? `Cập nhật thông tin phòng ban #${id}` : 'Tạo phòng ban mới'}
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

      {/* Form */}
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tên phòng ban"
              placeholder="Nhập tên phòng ban"
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mã phòng ban"
              placeholder="Nhập mã phòng ban"
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mô tả"
              placeholder="Nhập mô tả phòng ban"
              multiline
              rows={3}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Trưởng phòng"
              placeholder="Chọn trưởng phòng"
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Số lượng nhân viên tối đa"
              placeholder="Nhập số lượng"
              type="number"
              disabled
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Department Form Interface
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Form quản lý phòng ban sẽ được triển khai trong PHASE 4.
                <br />
                Bao gồm: validation, manager assignment, capacity management.
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
                  onClick={() => navigate(ROUTES.ADMIN.DEPARTMENTS.LIST)}
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

export default DepartmentForm;
