import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            variant={isActive('/') ? 'outlined' : 'text'}
          >
            대시보드
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/management')}
            variant={isActive('/management') ? 'outlined' : 'text'}
          >
            학생 관리
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/reports')}
            variant={isActive('/reports') ? 'outlined' : 'text'}
          >
            통계
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation; 