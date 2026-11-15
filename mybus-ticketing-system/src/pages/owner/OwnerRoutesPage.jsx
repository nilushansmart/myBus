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
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const OwnerRoutesPage = () => {
  const navigate = useNavigate();
  const { showToast, addNotification } = useNotification();

  const [trips, setTrips] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    busId: '',
    routeId: '',
    departureTime: '',
    arrivalTime: '',
    baseFare: 1500,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripRes, busRes, routeRes] = await Promise.all([
        api.get('/owner/trips'),
        api.get('/owner/buses'),
        api.get('/owner/routes'),
      ]);

      if (tripRes.success) setTrips(tripRes.data);
      if (busRes.success) {
        setBuses(busRes.data);
        if (busRes.data.length > 0) setFormData((prev) => ({ ...prev, busId: busRes.data[0].busId }));
      }
      if (routeRes.success) {
        setRoutes(routeRes.data);
        if (routeRes.data.length > 0) setFormData((prev) => ({ ...prev, routeId: routeRes.data[0].routeId }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load timetables');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    // Set default times (now + 2 hours and now + 6 hours)
    const now = new Date();
    now.setHours(now.getHours() + 2, 0, 0, 0);
    const depIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    const arr = new Date(now.getTime() + 4 * 3600000);
    const arrIso = new Date(arr.getTime() - arr.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    setFormData((prev) => ({
      ...prev,
      departureTime: depIso,
      arrivalTime: arrIso,
    }));
    setDialogOpen(true);
  };

  const handleSaveTrip = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/owner/trips', {
        ...formData,
        busId: Number(formData.busId),
        routeId: Number(formData.routeId),
        baseFare: Number(formData.baseFare),
      });

      if (res.success) {
        addNotification('Trip Scheduled', 'New journey successfully added to timetable', 'success');
        setDialogOpen(false);
        fetchData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to schedule trip', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to cancel and delete this trip?')) return;
    try {
      const res = await api.delete(`/owner/trips/${tripId}`);
      if (res.success) {
        addNotification('Trip Cancelled', `Trip #${tripId} has been removed`, 'info');
        fetchData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete trip', 'error');
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
            Routes & Timetable Schedules
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Publish trips, assign fleet buses, set base pricing, and adjust departure slots.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ fontWeight: 700 }}
        >
          Schedule New Journey
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
                  <TableCell sx={{ fontWeight: 700 }}>Route</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Bus Assigned</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Departure</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Arrival</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Base Fare</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.tripId} hover>
                    <TableCell sx={{ fontWeight: 800 }}>
                      {trip.originCity} → {trip.destinationCity}
                    </TableCell>
                    <TableCell>
                      {trip.registrationNumber} ({trip.busClass.replace(/_/g, ' ')})
                    </TableCell>
                    <TableCell>
                      {new Date(trip.departureTime).toLocaleString([], {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(trip.arrivalTime).toLocaleString([], {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>
                      LKR {Number(trip.baseFare).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={trip.status.toUpperCase()}
                        color={trip.status === 'scheduled' ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <IconButton
                        title="Delete Trip"
                        onClick={() => handleDeleteTrip(trip.tripId)}
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

      {/* Schedule Trip Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Schedule New Journey</DialogTitle>
        <Box component="form" onSubmit={handleSaveTrip}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              required
              fullWidth
              size="small"
              label="Select Route"
              value={formData.routeId}
              onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
            >
              {routes.map((r) => (
                <MenuItem key={r.routeId} value={r.routeId}>
                  {r.originStation.city} → {r.destinationStation.city} ({r.totalDistanceKm} km)
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              required
              fullWidth
              size="small"
              label="Assign Bus"
              value={formData.busId}
              onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
            >
              {buses.map((b) => (
                <MenuItem key={b.busId} value={b.busId}>
                  {b.registrationNumber} • {b.busClass.replace(/_/g, ' ')} ({b.totalCapacity} seats)
                </MenuItem>
              ))}
            </TextField>

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  type="datetime-local"
                  label="Departure Time"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  type="datetime-local"
                  label="Arrival Time"
                  value={formData.arrivalTime}
                  onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <TextField
              required
              fullWidth
              size="small"
              type="number"
              label="Base Fare per Seat (LKR)"
              value={formData.baseFare}
              onChange={(e) => setFormData({ ...formData, baseFare: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={submitting}>
              {submitting ? 'Scheduling...' : 'Publish Trip to Timetable'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
};

export default OwnerRoutesPage;
