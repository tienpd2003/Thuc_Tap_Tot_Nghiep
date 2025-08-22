import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon, Business as BusinessIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';

const DepartmentList = () => {
  const navigate = useNavigate();

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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(ROUTES.ADMIN.DEPARTMENTS.CREATE)}
          size="large"
        >
          Thêm phòng ban
        </Button>
      </Box>

      {/* Content */}
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <BusinessIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Department Management Interface
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Giao diện quản lý phòng ban sẽ được triển khai trong PHASE 4.
          <br />
          Bao gồm: DataGrid, CRUD forms, quản lý trưởng phòng, thống kê nhân sự.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate(ROUTES.ADMIN.DEPARTMENTS.CREATE)}
          >
            Thêm Phòng Ban Mới
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
          >
            Về Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DepartmentList;
