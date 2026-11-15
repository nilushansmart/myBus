import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { useNotification } from '../../context/NotificationContext';

const NotificationDrawer = () => {
  const { drawerOpen, setDrawerOpen, notifications } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon color="primary" />;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: { xs: '85vw', sm: 380 },
          maxWidth: '100%',
          p: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationsActiveIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Notifications
          </Typography>
          <Chip label={notifications.length} size="small" color="primary" />
        </Box>
        <IconButton onClick={() => setDrawerOpen(false)} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List sx={{ p: 0 }}>
        {notifications.map((n) => (
          <ListItem
            key={n.id}
            sx={{
              p: 1.5,
              mb: 1.5,
              borderRadius: 2,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1, mb: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>{getIcon(n.type)}</ListItemIcon>
              <Typography variant="subtitle2" fontWeight={700} sx={{ flex: 1 }}>
                {n.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {n.time}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
              {n.message}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default NotificationDrawer;
