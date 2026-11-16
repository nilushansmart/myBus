import { useState, useEffect, useCallback } from 'react';
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
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const OwnerFleetPage = () => {
  const navigate = useNavigate();
  const { showToast, addNotification } = useNotification();

  const [buses, setBuses] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    operatorId: '',
    registrationNumber: '',
    busClass: 'AC_Seater',
    totalCapacity: 40,
    isActive: true,
  });

  // Edit Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [editFormData, setEditFormData] = useState({
    operatorId: '',
    registrationNumber: '',
    busClass: 'AC_Seater',
    totalCapacity: 40,
    isActive: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchFleetData = useCallback(async () => {
    try {
      setLoading(true);
      const [busRes, opRes] = await Promise.all([
        api.get('/owner/buses'),
        api.get('/owner/operators'),
      ]);
      if (busRes.success) setBuses(busRes.data);
      if (opRes.success) {
        setOperators(opRes.data);
        if (opRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, operatorId: opRes.data[0].operatorId }));
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load fleet');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFleetData();
  }, [fetchFleetData]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData((prev) => ({
      ...prev,
      registrationNumber: '',
      busClass: 'AC_Seater',
      totalCapacity: 40,
      isActive: true,
    }));
  };

  const handleSaveBus = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/owner/buses', {
        ...formData,
        operatorId: Number(formData.operatorId),
        totalCapacity: Number(formData.totalCapacity),
      });
      if (res.success) {
        addNotification('Bus Created', `Bus ${formData.registrationNumber} added with seat layout`, 'success');
        handleCloseDialog();
        fetchFleetData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to save bus', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (bus) => {
    setEditingBus(bus);
    setEditFormData({
      operatorId: bus.operator?.operatorId || (operators[0]?.operatorId || ''),
      registrationNumber: bus.registrationNumber || '',
      busClass: bus.busClass || 'AC_Seater',
      totalCapacity: bus.totalCapacity || 40,
      isActive: bus.isActive !== false,
    });
    setEditDialogOpen(true);
  };

  const handleUpdateBus = async (e) => {
    e.preventDefault();
    if (!editingBus) return;
    setSubmitting(true);
    try {
      const res = await api.put(`/owner/buses/${editingBus.busId}`, {
        operatorId: Number(editFormData.operatorId),
        registrationNumber: editFormData.registrationNumber,
        busClass: editFormData.busClass,
        totalCapacity: Number(editFormData.totalCapacity),
        isActive: editFormData.isActive,
      });
      if (res.success) {
        addNotification('Bus Updated', `Bus ${editFormData.registrationNumber} updated successfully`, 'success');
        setEditDialogOpen(false);
        setEditingBus(null);
        fetchFleetData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update bus details', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegenerateSeats = async (busId, regNo) => {
    try {
      const res = await api.post(`/owner/buses/${busId}/seats/generate`);
      if (res.success) {
        showToast(`Seat layout regenerated for ${regNo}`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to regenerate seats', 'error');
    }
  };

  const handleDeleteBus = async (busId, regNo) => {
    if (!window.confirm(`Are you sure you want to delete bus ${regNo}?`)) return;
    try {
      const res = await api.delete(`/owner/buses/${busId}`);
      if (res.success) {
        addNotification('Bus Deleted', `Bus ${regNo} has been removed`, 'info');
        fetchFleetData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete bus', 'error');
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
            Fleet & Vehicle Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure bus models, capacities, and automated seat layouts.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ fontWeight: 700 }}
        >
          Add New Bus
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Registration Number</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Operator</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Class / Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Total Capacity</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {buses.map((bus) => (
                  <TableRow key={bus.busId} hover>
                    <TableCell sx={{ fontWeight: 800 }}>{bus.registrationNumber}</TableCell>
                    <TableCell>{bus.operator?.operatorName}</TableCell>
                    <TableCell>
                      <Chip
                        label={bus.busClass.replace(/_/g, ' ')}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>{bus.totalCapacity} Seats</TableCell>
                    <TableCell>
                      <Chip
                        label={bus.isActive ? 'ACTIVE' : 'INACTIVE'}
                        color={bus.isActive ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <IconButton
                        title="Edit Bus Details"
                        onClick={() => handleOpenEdit(bus)}
                        color="primary"
                        size="small"
                        sx={{ mr: 0.5 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        title="Regenerate Seats Grid"
                        onClick={() => handleRegenerateSeats(bus.busId, bus.registrationNumber)}
                        color="secondary"
                        size="small"
                        sx={{ mr: 0.5 }}
                      >
                        <RefreshIcon />
                      </IconButton>
                      <IconButton
                        title="Delete Bus"
                        onClick={() => handleDeleteBus(bus.busId, bus.registrationNumber)}
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

      {/* Add Bus Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Add New Bus to Fleet</DialogTitle>
        <Box component="form" onSubmit={handleSaveBus}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              required
              fullWidth
              size="small"
              label="Operator"
              value={formData.operatorId}
              onChange={(e) => setFormData({ ...formData, operatorId: e.target.value })}
            >
              {operators.map((op) => (
                <MenuItem key={op.operatorId} value={op.operatorId}>
                  {op.operatorName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              required
              fullWidth
              size="small"
              label="Registration Number (e.g. WP-ND-1020)"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
            />

            <TextField
              select
              required
              fullWidth
              size="small"
              label="Bus Class"
              value={formData.busClass}
              onChange={(e) => setFormData({ ...formData, busClass: e.target.value })}
            >
              <MenuItem value="AC_Seater">AC Seater (2+2)</MenuItem>
              <MenuItem value="Non_AC_Seater">Non-AC Seater (2+2)</MenuItem>
              <MenuItem value="AC_Sleeper">AC Sleeper (Upper/Lower Decks)</MenuItem>
              <MenuItem value="Non_AC_Sleeper">Non-AC Sleeper</MenuItem>
            </TextField>

            <TextField
              required
              fullWidth
              size="small"
              type="number"
              label="Total Capacity (Seats)"
              value={formData.totalCapacity}
              onChange={(e) => setFormData({ ...formData, totalCapacity: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={submitting}>
              {submitting ? 'Generating...' : 'Save & Build Layout'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Edit Bus Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Edit Bus Details</DialogTitle>
        <Box component="form" onSubmit={handleUpdateBus}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              required
              fullWidth
              size="small"
              label="Operator"
              value={editFormData.operatorId}
              onChange={(e) => setEditFormData({ ...editFormData, operatorId: e.target.value })}
            >
              {operators.map((op) => (
                <MenuItem key={op.operatorId} value={op.operatorId}>
                  {op.operatorName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              required
              fullWidth
              size="small"
              label="Registration Number"
              value={editFormData.registrationNumber}
              onChange={(e) => setEditFormData({ ...editFormData, registrationNumber: e.target.value })}
            />

            <TextField
              select
              required
              fullWidth
              size="small"
              label="Bus Class"
              value={editFormData.busClass}
              onChange={(e) => setEditFormData({ ...editFormData, busClass: e.target.value })}
            >
              <MenuItem value="AC_Seater">AC Seater (2+2)</MenuItem>
              <MenuItem value="Non_AC_Seater">Non-AC Seater (2+2)</MenuItem>
              <MenuItem value="AC_Sleeper">AC Sleeper (Upper/Lower Decks)</MenuItem>
              <MenuItem value="Non_AC_Sleeper">Non-AC Sleeper</MenuItem>
            </TextField>

            <TextField
              required
              fullWidth
              size="small"
              type="number"
              label="Total Capacity (Seats)"
              value={editFormData.totalCapacity}
              onChange={(e) => setEditFormData({ ...editFormData, totalCapacity: e.target.value })}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editFormData.isActive}
                  onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                  color="primary"
                />
              }
              label={editFormData.isActive ? 'Status: Active (Operational)' : 'Status: Inactive (Maintenance)'}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Bus Changes'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
};

export default OwnerFleetPage;
