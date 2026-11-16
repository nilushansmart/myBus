import React, { useState, useMemo } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';
import SecurityIcon from '@mui/icons-material/Security';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    const pwd = formData.password;
    if (!pwd) return { score: 0, label: '', color: 'inherit' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 33, label: 'Weak', color: 'error' };
    if (score <= 4) return { score: 66, label: 'Good', color: 'warning' };
    return { score: 100, label: 'Strong', color: 'success' };
  }, [formData.password]);

  // Confirm password validation state
  const passwordsMatch = useMemo(() => {
    if (!formData.confirmPassword) return true;
    return formData.password === formData.confirmPassword;
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!formData.fullName.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please provide a valid email address');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setError('Please provide your mobile phone number');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password do not match');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
      };

      const user = await register(payload);
      showToast(`Welcome to mybus, ${user.fullName}! Account created successfully.`, 'success');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.06)',
          bgcolor: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative Top Accent Bar */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: 'linear-gradient(90deg, #1e3a8a 0%, #06b6d4 100%)',
          }}
        />

        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 3.5, mt: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              bgcolor: 'primary.main',
              color: '#ffffff',
              p: 1.8,
              borderRadius: 3,
              mb: 2,
              boxShadow: '0 8px 20px rgba(30, 58, 138, 0.25)',
            }}
          >
            <HowToRegIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h4" fontWeight={800} color="#0f172a" sx={{ letterSpacing: '-0.5px' }}>
            Create Your Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Join thousands of travelers on Sri Lanka's leading bus ticketing network
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            icon={<ErrorOutlineIcon />}
            sx={{ mb: 3, borderRadius: 2.5, fontWeight: 500 }}
          >
            {error}
          </Alert>
        )}

        {/* Registration Form */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5}>
            {/* Full Name */}
            <TextField
              required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              placeholder="e.g. Nimal Fernando"
              autoFocus
              value={formData.fullName}
              onChange={handleChange}
              onBlur={() => handleBlur('fullName')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />

            {/* Email Address */}
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="e.g. nimal@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />

            {/* Phone Number */}
            <TextField
              required
              fullWidth
              id="phoneNumber"
              label="Mobile Number"
              name="phoneNumber"
              placeholder="+94771234567"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={() => handleBlur('phoneNumber')}
              helperText="Used for booking confirmations and SMS e-tickets"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneOutlinedIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />

            {/* Password */}
            <Box>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />

              {/* Password Strength Indicator */}
              {formData.password && (
                <Box sx={{ mt: 1, px: 0.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Strength:
                    </Typography>
                    <Chip
                      label={passwordStrength.label}
                      color={passwordStrength.color}
                      size="small"
                      sx={{ height: 18, fontSize: '0.68rem', fontWeight: 700 }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength.score}
                    color={passwordStrength.color}
                    sx={{ height: 5, borderRadius: 2.5 }}
                  />
                </Box>
              )}
            </Box>

            {/* Confirm Password */}
            <TextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur('confirmPassword')}
              error={touched.confirmPassword && !passwordsMatch}
              helperText={
                touched.confirmPassword && formData.confirmPassword
                  ? passwordsMatch
                    ? '✓ Passwords match'
                    : 'Passwords do not match'
                  : ''
              }
              FormHelperTextProps={{
                sx: {
                  color: passwordsMatch ? 'success.main' : 'error.main',
                  fontWeight: 600,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon
                      color={touched.confirmPassword && !passwordsMatch ? 'error' : 'action'}
                      fontSize="small"
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {formData.confirmPassword && (
                      passwordsMatch ? (
                        <CheckCircleOutlineIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                      ) : (
                        <ErrorOutlineIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                      )
                    )}
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={submitting || (Boolean(formData.confirmPassword) && !passwordsMatch)}
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <HowToRegIcon />}
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: 2.5,
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 8px 20px rgba(30, 58, 138, 0.3)',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              }}
            >
              {submitting ? 'Creating your account...' : 'Create Account'}
            </Button>
          </Stack>

          {/* Security Guarantee Note */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 3, color: '#64748b' }}>
            <SecurityIcon fontSize="small" color="action" />
            <Typography variant="caption">
              Your personal data and passwords are secure and encrypted with 256-bit SSL.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Sign In Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <RouterLink
                to="/login"
                style={{
                  color: '#1e3a8a',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Sign In here
              </RouterLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
