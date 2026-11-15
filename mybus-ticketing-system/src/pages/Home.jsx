import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Stack,
  Alert,
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Home = () => {
  const navigate = useNavigate();

  const [stations, setStations] = useState([]);
  const [originCity, setOriginCity] = useState('Colombo');
  const [destinationCity, setDestinationCity] = useState('Kandy');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [stationRes, tripRes] = await Promise.all([
        api.get('/public/stations'),
        api.get('/public/trips/search'),
      ]);

      if (stationRes.success) setStations(stationRes.data);
      if (tripRes.success) setTrips(tripRes.data);
    } catch (err) {
      setError('Failed to load trips. Make sure backend service is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setSearching(true);
    setError('');
    try {
      const res = await api.get('/public/trips/search', {
        params: { originCity, destinationCity, date },
      });
      if (res.success) {
        setTrips(res.data);
      }
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleSwapCities = () => {
    const temp = originCity;
    setOriginCity(destinationCity);
    setDestinationCity(temp);
  };

  const setPopularRoute = (origin, dest) => {
    setOriginCity(origin);
    setDestinationCity(dest);
    setTimeout(() => {
      handleSearch();
    }, 50);
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' });
  };

  const uniqueCities = Array.from(new Set(stations.map((s) => s.city)));

  return (
    <Box sx={{ minHeight: '100%', pb: { xs: 10, md: 6 } }}>
      {/* Hero Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0369a1 100%)',
          color: '#fff',
          pt: { xs: 4, sm: 6 },
          pb: { xs: 8, sm: 10 },
          px: 2,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Container maxWidth="md">
          <Chip
            icon={<DirectionsBusIcon sx={{ color: '#fff !important' }} />}
            label="SRI LANKA EXPRESS NETWORK"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: '#fff',
              fontWeight: 700,
              mb: 2,
              backdropFilter: 'blur(8px)',
            }}
          />
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              fontSize: { xs: '1.85rem', sm: '2.75rem' },
              letterSpacing: '-1px',
              mb: 1.5,
            }}
          >
            Smart, Mobile Bus Ticketing
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: 580,
              mx: 'auto',
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
            }}
          >
            Real-time seat selection, instant reservations, and mobile e-tickets on your thumb.
          </Typography>
        </Container>
      </Box>

      {/* Floating Search Container */}
      <Container maxWidth="lg" sx={{ mt: { xs: -5, sm: -6 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.08)',
            bgcolor: '#fff',
            mb: 4,
          }}
        >
          <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              {/* Origin */}
              <Grid size={{ xs: 12, sm: 5, md: 3.5 }}>
                <TextField
                  select
                  fullWidth
                  label="From (Origin)"
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  size="small"
                >
                  {uniqueCities.length > 0 ? (
                    uniqueCities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="Colombo">Colombo</MenuItem>
                  )}
                </TextField>
              </Grid>

              {/* Swap Button (Desktop) */}
              <Grid
                size={{ xs: 12, sm: 2, md: 1 }}
                sx={{ textAlign: 'center', my: { xs: -0.5, sm: 0 } }}
              >
                <Button
                  onClick={handleSwapCities}
                  sx={{
                    minWidth: 40,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: '#f1f5f9',
                    p: 0,
                  }}
                  aria-label="swap cities"
                >
                  <SwapHorizIcon color="primary" />
                </Button>
              </Grid>

              {/* Destination */}
              <Grid size={{ xs: 12, sm: 5, md: 3.5 }}>
                <TextField
                  select
                  fullWidth
                  label="To (Destination)"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  size="small"
                >
                  {uniqueCities.length > 0 ? (
                    uniqueCities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="Kandy">Kandy</MenuItem>
                  )}
                </TextField>
              </Grid>

              {/* Date */}
              <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                <TextField
                  type="date"
                  fullWidth
                  label="Departure Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>

              {/* Search CTA */}
              <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  size="large"
                  disabled={searching}
                  startIcon={searching ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
                  sx={{ py: 1.1, fontWeight: 700 }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Quick Popular Route Chips */}
          <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary">
              POPULAR:
            </Typography>
            <Chip
              label="Colombo → Kandy"
              size="small"
              onClick={() => setPopularRoute('Colombo', 'Kandy')}
              clickable
            />
            <Chip
              label="Colombo → Galle"
              size="small"
              onClick={() => setPopularRoute('Colombo', 'Galle')}
              clickable
            />
            <Chip
              label="Colombo → Jaffna"
              size="small"
              onClick={() => setPopularRoute('Colombo', 'Jaffna')}
              clickable
            />
            <Chip
              label="Kandy → Colombo"
              size="small"
              onClick={() => setPopularRoute('Kandy', 'Colombo')}
              clickable
            />
          </Box>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {/* Trips Section Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Available Scheduled Trips
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {trips.length} bus{trips.length === 1 ? '' : 'es'} found
          </Typography>
        </Box>

        {/* Loading Spinner */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : trips.length === 0 ? (
          /* Empty State */
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              bgcolor: '#fff',
            }}
          >
            <DirectionsBusIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
            <Typography variant="h6" fontWeight={700} gutterBottom>
              No scheduled buses found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try searching for different cities or adjust your departure date.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setOriginCity('Colombo');
                setDestinationCity('Kandy');
                fetchInitialData();
              }}
            >
              Reset Search Filter
            </Button>
          </Paper>
        ) : (
          /* Trip Cards List */
          <Stack spacing={2.5}>
            {trips.map((trip) => (
              <Card
                key={trip.tripId}
                elevation={0}
                sx={{
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.light',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                  <Grid container spacing={2} alignItems="center">
                    {/* Operator & Bus Type */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography variant="h6" fontWeight={700} color="primary.main">
                        {trip.operatorName}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                        <Chip
                          label={trip.busClass.replace(/_/g, ' ')}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={trip.registrationNumber}
                          size="small"
                          sx={{ bgcolor: '#f1f5f9' }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {formatDate(trip.departureTime)}
                      </Typography>
                    </Grid>

                    {/* Timeline & Duration */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          textAlign: 'center',
                        }}
                      >
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="h6" fontWeight={800}>
                            {formatTime(trip.departureTime)}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="text.primary">
                            {trip.originCity}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {trip.originStationName}
                          </Typography>
                        </Box>

                        <Box sx={{ px: 1 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {Math.floor(trip.estimatedDurationMinutes / 60)}h{' '}
                            {trip.estimatedDurationMinutes % 60}m
                          </Typography>
                          <Box
                            sx={{
                              width: { xs: 50, sm: 70 },
                              height: 2,
                              bgcolor: 'secondary.main',
                              my: 0.5,
                              position: 'relative',
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {trip.totalDistanceKm} km
                          </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" fontWeight={800}>
                            {formatTime(trip.arrivalTime)}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="text.primary">
                            {trip.destinationCity}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {trip.destinationStationName}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Price & CTA */}
                    <Grid
                      size={{ xs: 12, sm: 4 }}
                      sx={{
                        textAlign: { xs: 'left', sm: 'right' },
                        borderTop: { xs: '1px solid #f1f5f9', sm: 'none' },
                        pt: { xs: 2, sm: 0 },
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" display="block">
                        Starting from
                      </Typography>
                      <Typography
                        variant="h5"
                        fontWeight={800}
                        color="text.primary"
                        sx={{ letterSpacing: '-0.5px' }}
                      >
                        LKR {Number(trip.baseFare).toLocaleString()}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                          gap: 1,
                          my: 1,
                        }}
                      >
                        <AirlineSeatReclineExtraIcon
                          fontSize="small"
                          color={trip.availableSeats > 5 ? 'success' : 'error'}
                        />
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color={trip.availableSeats > 5 ? 'success.dark' : 'error.main'}
                        >
                          {trip.availableSeats} of {trip.totalSeats} seats available
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate(`/trips/${trip.tripId}/seats`)}
                        fullWidth
                        sx={{
                          fontWeight: 700,
                          py: 1,
                        }}
                      >
                        Select Seats
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default Home;
