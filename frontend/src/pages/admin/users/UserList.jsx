import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon, List as ListIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';

const UserList = () => {
  const navigate = useNavigate();

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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(ROUTES.ADMIN.USERS.CREATE)}
          size="large"
        >
          Thêm người dùng
        </Button>
      </Box>

      {/* Content */}
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <ListIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          User Management Interface
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Giao diện quản lý người dùng sẽ được triển khai trong PHASE 4.
          <br />
          Bao gồm: DataGrid, CRUD forms, tìm kiếm/lọc, phân quyền vai trò.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate(ROUTES.ADMIN.USERS.CREATE)}
          >
            Thêm User Mới
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

export default UserList;
