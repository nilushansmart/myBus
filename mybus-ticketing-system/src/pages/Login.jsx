import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.fullName}!`, 'success');

      if (user.role === 'ROLE_OWNER') {
        navigate(from === '/' ? '/owner/dashboard' : from, { replace: true });
      } else if (user.role === 'ROLE_STAFF') {
        navigate(from === '/' ? '/staff/checkin' : from, { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <Container maxWidth="xs" sx={{ py: { xs: 4, sm: 8 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
          bgcolor: '#fff',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              bgcolor: 'primary.main',
              color: '#fff',
              p: 1.5,
              borderRadius: 3,
              mb: 1.5,
            }}
          >
            <DirectionsBusIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h5" fontWeight={800} color="text.primary">
            Sign In to mybus
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Access express bus bookings & services
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <LockOpenIcon />}
            sx={{ mt: 2.5, mb: 2, py: 1.4 }}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </Button>

          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <RouterLink to="/register" style={{ color: '#2563eb', fontWeight: 600 }}>
                Register here
              </RouterLink>
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              OR QUICK TEST LOGINS
            </Typography>
          </Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => handleQuickFill('owner@mybus.com', 'password123')}
              sx={{ justifyContent: 'space-between' }}
            >
              <span>👑 Owner / Admin Portal</span>
              <Chip label="ROLE_OWNER" size="small" color="error" variant="outlined" />
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="warning"
              onClick={() => handleQuickFill('staff@mybus.com', 'password123')}
              sx={{ justifyContent: 'space-between' }}
            >
              <span>🦺 Conductor / Staff</span>
              <Chip label="ROLE_STAFF" size="small" color="warning" variant="outlined" />
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="success"
              onClick={() => handleQuickFill('passenger@mybus.com', 'password123')}
              sx={{ justifyContent: 'space-between' }}
            >
              <span>🧳 Passenger</span>
              <Chip label="ROLE_PASSENGER" size="small" color="success" variant="outlined" />
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
