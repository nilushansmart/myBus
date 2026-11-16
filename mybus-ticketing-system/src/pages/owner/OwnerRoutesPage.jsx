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
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RouteIcon from '@mui/icons-material/Route';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const OwnerRoutesPage = () => {
  const navigate = useNavigate();
  const { showToast, addNotification } = useNotification();

  const [activeTab, setActiveTab] = useState(0); // 0 = Timetables / Trips, 1 = Routes
  const [trips, setTrips] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialogs
  const [tripDialogOpen, setTripDialogOpen] = useState(false);
  const [routeDialogOpen, setRouteDialogOpen] = useState(false);

  // Forms
  const [tripFormData, setTripFormData] = useState({
    busId: '',
    routeId: '',
    departureTime: '',
    arrivalTime: '',
    baseFare: 1500,
  });

  const [routeFormData, setRouteFormData] = useState({
    originStationId: '',
    destinationStationId: '',
    estimatedDurationMinutes: 180,
    totalDistanceKm: 120.0,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tripRes, busRes, routeRes, stationRes] = await Promise.all([
        api.get('/owner/trips'),
        api.get('/owner/buses'),
        api.get('/owner/routes'),
        api.get('/public/stations'),
      ]);

      if (tripRes.success) setTrips(tripRes.data);
      if (busRes.success) {
        setBuses(busRes.data);
        if (busRes.data.length > 0) setTripFormData((prev) => ({ ...prev, busId: busRes.data[0].busId }));
      }
      if (routeRes.success) {
        setRoutes(routeRes.data);
        if (routeRes.data.length > 0) setTripFormData((prev) => ({ ...prev, routeId: routeRes.data[0].routeId }));
      }
      if (stationRes.success) {
        setStations(stationRes.data);
        if (stationRes.data.length >= 2) {
          setRouteFormData((prev) => ({
            ...prev,
            originStationId: stationRes.data[0].stationId,
            destinationStationId: stationRes.data[1].stationId,
          }));
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load routes and schedules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.get('/owner/trips'),
      api.get('/owner/buses'),
      api.get('/owner/routes'),
      api.get('/public/stations'),
    ])
      .then(([tripRes, busRes, routeRes, stationRes]) => {
        if (!isMounted) return;
        if (tripRes.success) setTrips(tripRes.data);
        if (busRes.success) {
          setBuses(busRes.data);
          if (busRes.data.length > 0) setTripFormData((prev) => ({ ...prev, busId: busRes.data[0].busId }));
        }
        if (routeRes.success) {
          setRoutes(routeRes.data);
          if (routeRes.data.length > 0) setTripFormData((prev) => ({ ...prev, routeId: routeRes.data[0].routeId }));
        }
        if (stationRes.success) {
          setStations(stationRes.data);
          if (stationRes.data.length >= 2) {
            setRouteFormData((prev) => ({
              ...prev,
              originStationId: stationRes.data[0].stationId,
              destinationStationId: stationRes.data[1].stationId,
            }));
          }
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed to load routes and schedules');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenTripDialog = () => {
    const now = new Date();
    now.setHours(now.getHours() + 2, 0, 0, 0);
    const depIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    const arr = new Date(now.getTime() + 4 * 3600000);
    const arrIso = new Date(arr.getTime() - arr.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    setTripFormData((prev) => ({
      ...prev,
      departureTime: depIso,
      arrivalTime: arrIso,
    }));
    setTripDialogOpen(true);
  };

  const handleSaveTrip = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/owner/trips', {
        ...tripFormData,
        busId: Number(tripFormData.busId),
        routeId: Number(tripFormData.routeId),
        baseFare: Number(tripFormData.baseFare),
      });

      if (res.success) {
        addNotification('Trip Scheduled', 'New journey successfully added to timetable', 'success');
        setTripDialogOpen(false);
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

  const handleSaveRoute = async (e) => {
    e.preventDefault();
    if (routeFormData.originStationId === routeFormData.destinationStationId) {
      showToast('Origin and Destination stations cannot be the same', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/owner/routes', {
        originStationId: Number(routeFormData.originStationId),
        destinationStationId: Number(routeFormData.destinationStationId),
        estimatedDurationMinutes: Number(routeFormData.estimatedDurationMinutes),
        totalDistanceKm: Number(routeFormData.totalDistanceKm),
      });

      if (res.success) {
        addNotification('Route Created', 'New express route created successfully', 'success');
        setRouteDialogOpen(false);
        fetchData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create route', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRoute = async (routeId) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;
    try {
      const res = await api.delete(`/owner/routes/${routeId}`);
      if (res.success) {
        addNotification('Route Deleted', `Route #${routeId} has been removed`, 'info');
        fetchData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete route', 'error');
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
            Routes & Timetable Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage origin-destination corridors, schedule trips, assign fleet buses, and set fares.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<RouteIcon />}
            onClick={() => setRouteDialogOpen(true)}
            sx={{ fontWeight: 700 }}
          >
            Create New Route
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenTripDialog}
            sx={{ fontWeight: 700 }}
          >
            Schedule Trip
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          sx={{ borderBottom: '1px solid #e2e8f0', px: 2 }}
        >
          <Tab label={`Scheduled Trips (${trips.length})`} icon={<DirectionsBusIcon />} iconPosition="start" sx={{ fontWeight: 700 }} />
          <Tab label={`Configured Routes (${routes.length})`} icon={<RouteIcon />} iconPosition="start" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Paper>

      {/* Tab 0: Scheduled Trips */}
      {activeTab === 0 && (
        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', p: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : trips.length === 0 ? (
            <Typography sx={{ p: 4, textAlign: 'center' }} color="text.secondary">
              No trips scheduled yet. Click "Schedule Trip" to add one.
            </Typography>
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
                    <TableCell sx={{ fontWeight: 700 }}>Available Seats</TableCell>
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
                        {trip.registrationNumber} ({trip.busClass?.replace(/_/g, ' ')})
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
                          label={`${trip.availableSeats} / ${trip.totalSeats}`}
                          color={trip.availableSeats > 5 ? 'success' : 'warning'}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 700 }}
                        />
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
                          title="Delete / Cancel Trip"
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
      )}

      {/* Tab 1: Configured Routes */}
      {activeTab === 1 && (
        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', p: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : routes.length === 0 ? (
            <Typography sx={{ p: 4, textAlign: 'center' }} color="text.secondary">
              No routes configured yet. Click "Create New Route" to add one.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Route ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Origin Station</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Destination Station</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Distance (KM)</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Est. Duration</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {routes.map((r) => (
                    <TableRow key={r.routeId} hover>
                      <TableCell sx={{ fontWeight: 800 }}>#{r.routeId}</TableCell>
                      <TableCell>
                        <strong>{r.originStation?.city}</strong> ({r.originStation?.stationName})
                      </TableCell>
                      <TableCell>
                        <strong>{r.destinationStation?.city}</strong> ({r.destinationStation?.stationName})
                      </TableCell>
                      <TableCell>{r.totalDistanceKm} km</TableCell>
                      <TableCell>
                        {Math.floor(r.estimatedDurationMinutes / 60)}h {r.estimatedDurationMinutes % 60}m
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <IconButton
                          title="Delete Route"
                          onClick={() => handleDeleteRoute(r.routeId)}
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
      )}

      {/* Schedule Trip Dialog */}
      <Dialog open={tripDialogOpen} onClose={() => setTripDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Schedule New Journey</DialogTitle>
        <Box component="form" onSubmit={handleSaveTrip}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              required
              fullWidth
              size="small"
              label="Select Route"
              value={tripFormData.routeId}
              onChange={(e) => setTripFormData({ ...tripFormData, routeId: e.target.value })}
            >
              {routes.map((r) => (
                <MenuItem key={r.routeId} value={r.routeId}>
                  {r.originStation?.city} → {r.destinationStation?.city} ({r.totalDistanceKm} km)
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              required
              fullWidth
              size="small"
              label="Assign Bus"
              value={tripFormData.busId}
              onChange={(e) => setTripFormData({ ...tripFormData, busId: e.target.value })}
            >
              {buses.map((b) => (
                <MenuItem key={b.busId} value={b.busId}>
                  {b.registrationNumber} • {b.busClass?.replace(/_/g, ' ')} ({b.totalCapacity} seats)
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
                  value={tripFormData.departureTime}
                  onChange={(e) => setTripFormData({ ...tripFormData, departureTime: e.target.value })}
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
                  value={tripFormData.arrivalTime}
                  onChange={(e) => setTripFormData({ ...tripFormData, arrivalTime: e.target.value })}
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
              value={tripFormData.baseFare}
              onChange={(e) => setTripFormData({ ...tripFormData, baseFare: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setTripDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={submitting}>
              {submitting ? 'Scheduling...' : 'Publish Trip to Timetable'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Create Route Dialog */}
      <Dialog open={routeDialogOpen} onClose={() => setRouteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create New Express Route</DialogTitle>
        <Box component="form" onSubmit={handleSaveRoute}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              required
              fullWidth
              size="small"
              label="Origin Terminal / Station"
              value={routeFormData.originStationId}
              onChange={(e) => setRouteFormData({ ...routeFormData, originStationId: e.target.value })}
            >
              {stations.map((s) => (
                <MenuItem key={s.stationId} value={s.stationId}>
                  {s.city} - {s.stationName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              required
              fullWidth
              size="small"
              label="Destination Terminal / Station"
              value={routeFormData.destinationStationId}
              onChange={(e) => setRouteFormData({ ...routeFormData, destinationStationId: e.target.value })}
            >
              {stations.map((s) => (
                <MenuItem key={s.stationId} value={s.stationId}>
                  {s.city} - {s.stationName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              required
              fullWidth
              size="small"
              type="number"
              label="Total Distance (KM)"
              value={routeFormData.totalDistanceKm}
              onChange={(e) => setRouteFormData({ ...routeFormData, totalDistanceKm: e.target.value })}
            />

            <TextField
              required
              fullWidth
              size="small"
              type="number"
              label="Estimated Duration (Minutes)"
              value={routeFormData.estimatedDurationMinutes}
              onChange={(e) => setRouteFormData({ ...routeFormData, estimatedDurationMinutes: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setRouteDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Route'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
};

export default OwnerRoutesPage;
