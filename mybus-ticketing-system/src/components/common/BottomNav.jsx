import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BottomNav = () => {
  const { isAuthenticated, isOwner, isStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentValue = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path.startsWith('/my-bookings')) return 1;
    if (path.startsWith('/staff/checkin')) return 2;
    if (path.startsWith('/owner')) return 2;
    if (path === '/login' || path === '/register') return 3;
    return 0;
  };

  return (
    <Paper
      className="no-print"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: { xs: 'block', md: 'none' },
        borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={getCurrentValue()}
        onChange={(event, newValue) => {
          if (newValue === 0) navigate('/');
          else if (newValue === 1) navigate('/my-bookings');
          else if (newValue === 2) {
            if (isOwner) navigate('/owner/dashboard');
            else if (isStaff) navigate('/staff/checkin');
            else navigate('/login');
          } else if (newValue === 3) {
            navigate('/login');
          }
        }}
      >
        <BottomNavigationAction label="Search" icon={<DirectionsBusIcon />} />
        <BottomNavigationAction label="Bookings" icon={<ConfirmationNumberIcon />} />
        {isOwner ? (
          <BottomNavigationAction label="Admin" icon={<DashboardIcon />} />
        ) : isStaff ? (
          <BottomNavigationAction label="Check-in" icon={<QrCodeScannerIcon />} />
        ) : null}
        <BottomNavigationAction
          label={isAuthenticated ? 'Account' : 'Sign In'}
          icon={<PersonIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
