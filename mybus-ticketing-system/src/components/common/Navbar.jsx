import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  Badge,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import RouteIcon from '@mui/icons-material/Route';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, isOwner, isStaff, isPassenger } = useAuth();
  const { setDrawerOpen, notifications } = useNotification();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const getRoleLabel = (role) => {
    if (role === 'ROLE_OWNER') return 'Owner';
    if (role === 'ROLE_STAFF') return 'Staff';
    return 'Passenger';
  };

  const getRoleColor = (role) => {
    if (role === 'ROLE_OWNER') return 'error';
    if (role === 'ROLE_STAFF') return 'warning';
    return 'success';
  };

  return (
    <>
      <AppBar
        position="sticky"
        className="no-print"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
          color: 'text.primary',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 58, md: 64 } }}>
            {/* Mobile Hamburger */}
            <IconButton
              size="medium"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 1, display: { md: 'none' } }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* Brand Logo */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                color: 'primary.main',
                mr: 3,
              }}
            >
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  color: '#fff',
                  p: 0.8,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DirectionsBusIcon fontSize="small" />
              </Box>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 800,
                  fontFamily: '"Space Grotesk", sans-serif',
                  letterSpacing: '-0.5px',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                my<span style={{ color: '#06b6d4' }}>bus</span>
              </Typography>
            </Box>

            {/* Desktop Navigation Links */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Button component={RouterLink} to="/" color="inherit">
                Search Trips
              </Button>

              <Button component={RouterLink} to="/tasks" startIcon={<AssignmentIcon />} color="inherit">
                Tasks
              </Button>

              {isAuthenticated && !isStaff && !isOwner && (
                <Button component={RouterLink} to="/my-bookings" color="inherit">
                  My Bookings
                </Button>
              )}

              {isStaff && (
                <Button
                  component={RouterLink}
                  to="/staff/checkin"
                  startIcon={<QrCodeScannerIcon />}
                  color="warning"
                  variant="outlined"
                  size="small"
                  sx={{ my: 'auto' }}
                >
                  Conductor Check-in
                </Button>
              )}

              {isOwner && (
                <>
                  <Button
                    component={RouterLink}
                    to="/owner/dashboard"
                    startIcon={<DashboardIcon />}
                    color="primary"
                    variant="text"
                  >
                    Admin Dashboard
                  </Button>
                  <Button component={RouterLink} to="/owner/fleet" color="inherit">
                    Fleet
                  </Button>
                  <Button component={RouterLink} to="/owner/routes" color="inherit">
                    Routes
                  </Button>
                  <Button component={RouterLink} to="/owner/staff" color="inherit">
                    Staff
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/owner/billing"
                    startIcon={<MonetizationOnIcon />}
                    color="secondary"
                    variant="outlined"
                    size="small"
                    sx={{ my: 'auto' }}
                  >
                    Billing & Docs Hub
                  </Button>
                </>
              )}
            </Box>

            {/* Right actions: Notification & Auth */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="medium"
                color="inherit"
                onClick={() => setDrawerOpen(true)}
                aria-label="open notifications"
              >
                <Badge badgeContent={notifications.length} color="secondary">
                  <NotificationsIcon color="action" />
                </Badge>
              </IconButton>

              {isAuthenticated ? (
                <>
                  <Chip
                    label={getRoleLabel(user?.role)}
                    color={getRoleColor(user?.role)}
                    size="small"
                    sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                  />
                  <IconButton
                    size="medium"
                    edge="end"
                    aria-label="account of current user"
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <AccountCircleIcon color="primary" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      sx: { minWidth: 200, p: 0.5, borderRadius: 3 },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {user?.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 0.5 }} />
                    {!isOwner && !isStaff && (
                      <MenuItem component={RouterLink} to="/my-bookings" onClick={handleMenuClose}>
                        <ListItemIcon>
                          <ConfirmationNumberIcon fontSize="small" />
                        </ListItemIcon>
                        My Bookings
                      </MenuItem>
                    )}
                    {isOwner && (
                      <MenuItem component={RouterLink} to="/owner/dashboard" onClick={handleMenuClose}>
                        <ListItemIcon>
                          <DashboardIcon fontSize="small" />
                        </ListItemIcon>
                        Owner Portal
                      </MenuItem>
                    )}
                    {isStaff && (
                      <MenuItem component={RouterLink} to="/staff/checkin" onClick={handleMenuClose}>
                        <ListItemIcon>
                          <QrCodeScannerIcon fontSize="small" />
                        </ListItemIcon>
                        Check-in Portal
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                      </ListItemIcon>
                      Sign Out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    size="small"
                    color="primary"
                  >
                    Sign In
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    size="small"
                    color="primary"
                    sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{ sx: { width: 280, p: 2 } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <DirectionsBusIcon color="primary" />
          <Typography variant="h6" fontWeight={800} color="primary.main">
            my<span style={{ color: '#06b6d4' }}>bus</span>
          </Typography>
        </Box>
        <Divider sx={{ mb: 1.5 }} />

        {isAuthenticated && (
          <Box sx={{ p: 1.5, mb: 1.5, bgcolor: '#f1f5f9', borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              {user?.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip label={getRoleLabel(user?.role)} color={getRoleColor(user?.role)} size="small" />
            </Box>
          </Box>
        )}

        <List>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/" onClick={() => setMobileMenuOpen(false)}>
              <ListItemIcon>
                <DirectionsBusIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Search Trips" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/tasks" onClick={() => setMobileMenuOpen(false)}>
              <ListItemIcon>
                <AssignmentIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Task Manager" />
            </ListItemButton>
          </ListItem>

          {isAuthenticated && !isStaff && !isOwner && (
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemIcon>
                  <ConfirmationNumberIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="My Bookings" />
              </ListItemButton>
            </ListItem>
          )}

          {isStaff && (
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/staff/checkin"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemIcon>
                  <QrCodeScannerIcon color="warning" />
                </ListItemIcon>
                <ListItemText primary="Staff Check-in" />
              </ListItemButton>
            </ListItem>
          )}

          {isOwner && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ px: 2, fontWeight: 700 }}>
                OWNER MANAGEMENT
              </Typography>
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/owner/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemIcon>
                    <DashboardIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/owner/fleet"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemIcon>
                    <DirectionsBusIcon />
                  </ListItemIcon>
                  <ListItemText primary="Fleet & Buses" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/owner/routes"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemIcon>
                    <RouteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Routes & Timetables" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/owner/staff"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Staff Team" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/owner/billing"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemIcon>
                    <MonetizationOnIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="Billing & Docs Hub" />
                </ListItemButton>
              </ListItem>
            </>
          )}

          <Divider sx={{ my: 1 }} />

          {isAuthenticated ? (
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
              </ListItemButton>
            </ListItem>
          ) : (
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemIcon>
                  <AccountCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Sign In / Register" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
