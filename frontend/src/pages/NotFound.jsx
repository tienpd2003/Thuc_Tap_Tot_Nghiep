import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" sx={{ fontSize: '8rem', fontWeight: 'bold', color: 'primary.main' }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
          Trang không tìm thấy
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </Typography>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
          size="large"
        >
          Về Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
