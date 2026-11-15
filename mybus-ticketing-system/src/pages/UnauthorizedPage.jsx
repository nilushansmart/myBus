import React from 'react';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          textAlign: 'center',
          borderRadius: 4,
          border: '1px solid #fee2e2',
          bgcolor: '#fff',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: '#fef2f2',
            color: 'error.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <BlockIcon sx={{ fontSize: 44 }} />
        </Box>

        <Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
          Access Denied (403)
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          You do not have the required permissions to access this page with your current role{' '}
          <strong>({user?.role || 'Guest'})</strong>.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
          >
            Return Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UnauthorizedPage;
