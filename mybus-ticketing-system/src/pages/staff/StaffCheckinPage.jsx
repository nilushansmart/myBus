import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  MenuItem,
  InputAdornment,
  Divider,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PeopleIcon from '@mui/icons-material/People';
import api from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const StaffCheckinPage = () => {
  const { showToast, addNotification } = useNotification();

  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [manifest, setManifest] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [manifestLoading, setManifestLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAssignedTrips();
  }, []);

  useEffect(() => {
    if (selectedTripId) {
      fetchManifest(selectedTripId, keyword);
    }
  }, [selectedTripId]);

  const fetchAssignedTrips = async () => {
    try {
      setLoading(true);
      const res = await api.get('/staff/trips');
      if (res.success && res.data.length > 0) {
        setTrips(res.data);
        setSelectedTripId(res.data[0].tripId);
      }
    } catch (err) {
      showToast('Failed to load trips for check-in: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchManifest = async (tripId, searchKeyword = '') => {
    try {
      setManifestLoading(true);
      const res = await api.get(`/staff/trips/${tripId}/search`, {
        params: { keyword: searchKeyword },
      });
      if (res.success) {
        setManifest(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load trip manifest', 'error');
    } finally {
      setManifestLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (selectedTripId) {
      fetchManifest(selectedTripId, keyword);
    }
  };

  const handleToggleCheckin = async (ticket) => {
    try {
      setUpdatingId(ticket.ticketId);
      const newStatus = !ticket.isCheckedIn;
      const res = await api.post('/staff/tickets/checkin', {
        ticketId: ticket.ticketId,
        isCheckedIn: newStatus,
      });

      if (res.success) {
        setManifest((prev) =>
          prev.map((t) => (t.ticketId === ticket.ticketId ? res.data : t))
        );
        addNotification(
          newStatus ? 'Passenger Checked-In' : 'Check-in Revoked',
          `Seat ${ticket.seatNumber} (${ticket.passengerName})`,
          newStatus ? 'success' : 'info'
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to update check-in status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const selectedTrip = trips.find((t) => t.tripId === Number(selectedTripId));
  const checkedInCount = manifest.filter((t) => t.isCheckedIn).length;

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Box
            sx={{
              bgcolor: 'warning.main',
              color: '#fff',
              p: 1,
              borderRadius: 2,
              display: 'flex',
            }}
          >
            <QrCodeScannerIcon />
          </Box>
          <Typography variant="h4" fontWeight={800}>
            Conductor Check-in Portal
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Validate passenger electronic boarding passes and verify attendance in real-time.
        </Typography>
      </Box>

      {/* Select Trip & Search Filters */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          mb: 3,
          bgcolor: '#fff',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Select Assigned Trip"
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
            >
              {trips.map((t) => (
                <MenuItem key={t.tripId} value={t.tripId}>
                  {t.originCity} → {t.destinationCity} ({t.registrationNumber}) •{' '}
                  {new Date(t.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box component="form" onSubmit={handleSearchSubmit}>
              <TextField
                fullWidth
                size="small"
                label="Search by Name, Seat #, or Ref"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button type="submit" size="small" variant="contained" color="warning">
                        <SearchIcon fontSize="small" />
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Trip Quick Stats Bar */}
      {selectedTrip && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3 }}>
              <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <PeopleIcon color="primary" sx={{ fontSize: 36 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Booked Passengers
                  </Typography>
                  <Typography variant="h5" fontWeight={800}>
                    {manifest.length}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 6, sm: 4 }}>
            <Card elevation={0} sx={{ border: '1px solid #bbf7d0', borderRadius: 3, bgcolor: '#f0fdf4' }}>
              <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 36 }} />
                <Box>
                  <Typography variant="caption" color="success.dark">
                    Checked In / Onboard
                  </Typography>
                  <Typography variant="h5" fontWeight={800} color="success.main">
                    {checkedInCount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 6, sm: 4 }}>
            <Card elevation={0} sx={{ border: '1px solid #fed7aa', borderRadius: 3, bgcolor: '#fff7ed' }}>
              <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <RadioButtonUncheckedIcon color="warning" sx={{ fontSize: 36 }} />
                <Box>
                  <Typography variant="caption" color="warning.dark">
                    Pending Verification
                  </Typography>
                  <Typography variant="h5" fontWeight={800} color="warning.main">
                    {manifest.length - checkedInCount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Manifest Passenger List */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Passenger Manifest
      </Typography>

      {manifestLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress color="warning" />
        </Box>
      ) : manifest.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            bgcolor: '#fff',
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No passengers found matching search criteria for this trip.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {manifest.map((t) => (
            <Card
              key={t.ticketId}
              elevation={0}
              sx={{
                borderRadius: 3,
                border: t.isCheckedIn ? '1px solid #86efac' : '1px solid #e2e8f0',
                bgcolor: t.isCheckedIn ? '#f0fdf4' : '#fff',
                transition: 'all 0.2s',
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: t.isCheckedIn ? 'success.main' : 'primary.main',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1.05rem',
                      }}
                    >
                      {t.seatNumber}
                    </Box>

                    <Box>
                      <Typography variant="subtitle1" fontWeight={800}>
                        {t.passengerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Age: {t.passengerAge} • {t.passengerGender.toUpperCase()} • Deck: {t.deck}
                      </Typography>
                      {t.boardingStationName && (
                        <Typography variant="caption" color="primary.main" display="block">
                          Boarding: {t.boardingStationName}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Status
                      </Typography>
                      <Chip
                        label={t.isCheckedIn ? 'CHECKED-IN' : 'PENDING'}
                        color={t.isCheckedIn ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 800 }}
                      />
                    </Box>

                    <Button
                      variant={t.isCheckedIn ? 'outlined' : 'contained'}
                      color={t.isCheckedIn ? 'error' : 'success'}
                      size="small"
                      disabled={updatingId === t.ticketId}
                      startIcon={
                        updatingId === t.ticketId ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : t.isCheckedIn ? (
                          <RadioButtonUncheckedIcon />
                        ) : (
                          <CheckCircleIcon />
                        )
                      }
                      onClick={() => handleToggleCheckin(t)}
                      sx={{ fontWeight: 700, minWidth: 120 }}
                    >
                      {t.isCheckedIn ? 'Undo Check-in' : 'Check-In'}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default StaffCheckinPage;
