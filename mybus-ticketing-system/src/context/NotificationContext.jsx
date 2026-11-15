import React, { createContext, useContext, useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 'init-1',
      title: 'Welcome to mybus!',
      message: 'Explore express bus routes across Colombo, Kandy, Galle, and Jaffna.',
      type: 'info',
      time: 'Just now',
    },
    {
      id: 'init-2',
      title: 'Real-time Ticket Tracking',
      message: 'Printable digital boarding passes with QR codes are active.',
      type: 'success',
      time: '5m ago',
    },
  ]);

  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success' | 'info' | 'warning' | 'error'
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const showToast = (message, severity = 'info') => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const addNotification = (title, message, type = 'info') => {
    const newNote = {
      id: Date.now().toString(),
      title,
      message,
      type,
      time: 'Just now',
    };
    setNotifications((prev) => [newNote, ...prev]);
    showToast(`${title}: ${message}`, type);
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        showToast,
        drawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 7 }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            fontWeight: 600,
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
