import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BottomNav = () => {
  const { isAuthenticated, isOwner, isStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine actions dynamically based on role
  // Staff and Owner do not want "My Bookings" option
  const actions = React.useMemo(() => {
    const list = [
      { label: 'Search', icon: <DirectionsBusIcon />, path: '/' },
    ];

    if (!isOwner && !isStaff) {
      list.push({ label: 'Bookings', icon: <ConfirmationNumberIcon />, path: '/my-bookings' });
    }

    list.push({ label: 'Tasks', icon: <AssignmentIcon />, path: '/tasks' });

    if (isOwner) {
      list.push({ label: 'Admin', icon: <DashboardIcon />, path: '/owner/dashboard' });
    } else if (isStaff) {
      list.push({ label: 'Check-in', icon: <QrCodeScannerIcon />, path: '/staff/checkin' });
    }

    list.push({
      label: isAuthenticated ? 'Account' : 'Sign In',
      icon: <PersonIcon />,
      path: '/login',
    });

    return list;
  }, [isAuthenticated, isOwner, isStaff]);

  const currentIndex = actions.findIndex((a) => {
    if (a.path === '/' && location.pathname === '/') return true;
    if (a.path !== '/' && location.pathname.startsWith(a.path)) return true;
    return false;
  });

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
        value={currentIndex >= 0 ? currentIndex : 0}
        onChange={(event, newValue) => {
          const selectedAction = actions[newValue];
          if (selectedAction) {
            navigate(selectedAction.path);
          }
        }}
      >
        {actions.map((action, idx) => (
          <BottomNavigationAction
            key={idx}
            label={action.label}
            icon={action.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
