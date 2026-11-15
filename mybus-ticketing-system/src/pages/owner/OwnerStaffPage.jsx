import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const OwnerStaffPage = () => {
  const navigate = useNavigate();
  const { showToast, addNotification } = useNotification();

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: 'password123',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get('/owner/staff');
      if (res.success) {
        setStaffList(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load staff list');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/owner/staff', formData);
      if (res.success) {
        addNotification('Staff Registered', `Created staff account for ${formData.fullName}`, 'success');
        setDialogOpen(false);
        setFormData({ fullName: '', email: '', phoneNumber: '', password: 'password123' });
        fetchStaff();
      }
    } catch (err) {
      showToast(err.message || 'Failed to add staff', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStaff = async (staffId, name) => {
    if (!window.confirm(`Are you sure you want to remove staff member ${name}?`)) return;
    try {
      const res = await api.delete(`/owner/staff/${staffId}`);
      if (res.success) {
        addNotification('Staff Removed', `Removed ${name} from operations team`, 'info');
        fetchStaff();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete staff member', 'error');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/owner/dashboard')} sx={{ mb: 1 }}>
            Back to Dashboard
          </Button>
          <Typography variant="h4" fontWeight={800}>
            Staff & Crew Administration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage authorized conductors, drivers, and ground validation crew.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ fontWeight: 700 }}
        >
          Add Crew Member
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : staffList.length === 0 ? (
          <Typography sx={{ p: 4, textAlign: 'center' }} color="text.secondary">
            No staff members registered.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Staff Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Phone Number</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Role Assignment</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staffList.map((st) => (
                  <TableRow key={st.userId} hover>
                    <TableCell sx={{ fontWeight: 800 }}>{st.fullName}</TableCell>
                    <TableCell>{st.email}</TableCell>
                    <TableCell>{st.phoneNumber}</TableCell>
                    <TableCell>
                      <Chip
                        label="CONDUCTOR / CREW"
                        color="warning"
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <IconButton
                        title="Delete Staff"
                        onClick={() => handleDeleteStaff(st.userId, st.fullName)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add Staff Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Crew / Conductor</DialogTitle>
        <Box component="form" onSubmit={handleSaveStaff}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              fullWidth
              size="small"
              label="Full Name (e.g. Ruwan Silva)"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />

            <TextField
              required
              fullWidth
              size="small"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <TextField
              required
              fullWidth
              size="small"
              label="Mobile Phone (+94...)"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />

            <TextField
              required
              fullWidth
              size="small"
              type="password"
              label="Access Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={submitting}>
              {submitting ? 'Registering...' : 'Register Staff Account'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
};

export default OwnerStaffPage;
