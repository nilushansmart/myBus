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
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
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
      {/* Hero Header with Background Bus Artwork */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #091a3e 0%, #15326a 45%, #0284c7 100%)',
          color: '#fff',
          pt: { xs: 5, sm: 7, md: 8 },
          pb: { xs: 10, sm: 12, md: 14 },
          px: { xs: 2, sm: 3 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient Radial Lighting Glows */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(30, 58, 138, 0.4) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Background Bus Silhouette Watermark */}
        <Box
          sx={{
            position: 'absolute',
            right: { xs: -40, sm: -20, md: '4%', lg: '8%' },
            bottom: { xs: -10, sm: 0, md: 10 },
            width: { xs: 280, sm: 400, md: 540, lg: 620 },
            opacity: { xs: 0.1, sm: 0.14, md: 0.18 },
            filter: 'brightness(0) invert(1)',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 1,
          }}
        >
          <Box
            component="img"
            src="/hero-bus.png"
            alt=""
            sx={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </Box>

        {/* Hero Content Container */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            {/* Left Column: Headline & Value Proposition */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                icon={<DirectionsBusIcon sx={{ color: '#38bdf8 !important' }} />}
                label="SRI LANKA EXPRESS NETWORK"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  letterSpacing: 0.8,
                  mb: 2.5,
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              />

              <Typography
                variant="h2"
                fontWeight={900}
                sx={{
                  fontSize: { xs: '2.1rem', sm: '2.9rem', md: '3.4rem' },
                  letterSpacing: '-1.5px',
                  lineHeight: 1.15,
                  mb: 2,
                }}
              >
                Travel Across Sri Lanka{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(90deg, #38bdf8 0%, #67e8f9 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: { xs: 'inline', sm: 'inline-block' },
                  }}
                >
                  in Style & Comfort
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  maxWidth: 560,
                  color: 'rgba(255, 255, 255, 0.88)',
                  fontSize: { xs: '0.98rem', sm: '1.15rem' },
                  lineHeight: 1.6,
                  mb: 3.5,
                }}
              >
                Instant seat selection, verified air-conditioned luxury express coaches, and digital QR boarding passes on your mobile thumb.
              </Typography>

              {/* Value Badges */}
              <Stack direction="row" spacing={{ xs: 1, sm: 2 }} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'rgba(255, 255, 255, 0.95)' }}>
                  <QrCode2Icon sx={{ color: '#38bdf8', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Instant QR E-Tickets
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'rgba(255, 255, 255, 0.95)' }}>
                  <AirlineSeatReclineExtraIcon sx={{ color: '#facc15', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Choose Exact Seat
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'rgba(255, 255, 255, 0.95)' }}>
                  <VerifiedUserIcon sx={{ color: '#4ade80', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    100% Confirmed
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Right Column: Hero Express Bus Showcase Card (Desktop) */}
            <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 440,
                  p: 3,
                  borderRadius: 5,
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
                }}
              >
                <Box
                  component="img"
                  src="/hero-bus.png"
                  alt="MyBus Express Luxury Fleet"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    filter: 'brightness(0) invert(1) drop-shadow(0 15px 25px rgba(56, 189, 248, 0.45))',
                    transform: 'scale(1.02)',
                  }}
                />

                {/* Floating Highlights on Card */}
                <Chip
                  icon={<ConfirmationNumberIcon sx={{ fontSize: '14px !important', color: '#38bdf8 !important' }} />}
                  label="Express Fleet • 50+ Routes"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    bgcolor: 'rgba(15, 23, 42, 0.85)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    backdropFilter: 'blur(6px)',
                  }}
                />
                <Chip
                  label="⭐ Rated 4.9 by 50,000+ Riders"
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    bgcolor: 'rgba(15, 23, 42, 0.85)',
                    color: '#facc15',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    border: '1px solid rgba(250, 204, 21, 0.4)',
                    backdropFilter: 'blur(6px)',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Floating Search Container */}
      <Container maxWidth="lg" sx={{ mt: { xs: -6, sm: -8 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
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

              {/* Swap Button */}
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
          /* Trips List Grid */
          <Grid container spacing={2.5}>
            {trips.map((trip) => (
              <Grid size={{ xs: 12, md: 6 }} key={trip.tripId}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                      borderColor: 'primary.light',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    {/* Top Row: Operator, Bus Type & Price */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                          {trip.operatorName}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                          <Chip
                            label={trip.busClass?.replace(/_/g, ' ')}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {trip.registrationNumber}
                          </Typography>
                        </Stack>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">
                          Starting from
                        </Typography>
                        <Typography variant="h6" fontWeight={800} color="primary.main">
                          LKR {Number(trip.baseFare).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

                    {/* Middle Row: Schedule / Stations */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 1.5 }}>
                      {/* Origin */}
                      <Box sx={{ minWidth: 90 }}>
                        <Typography variant="h6" fontWeight={800} color="text.primary">
                          {formatTime(trip.departureTime)}
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="text.secondary">
                          {trip.originCity}
                        </Typography>
                      </Box>

                      {/* Timeline / Duration Indicator */}
                      <Box sx={{ flex: 1, px: 2, textAlign: 'center' }}>
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                          <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {Math.floor(trip.estimatedDurationMinutes / 60)}h {trip.estimatedDurationMinutes % 60}m
                          </Typography>
                        </Stack>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            my: 0.5,
                          }}
                        >
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                          <Box sx={{ flex: 1, height: 2, bgcolor: '#cbd5e1' }} />
                          <ArrowForwardIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                          <Box sx={{ flex: 1, height: 2, bgcolor: '#cbd5e1' }} />
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'secondary.main' }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
                          Direct Expressway
                        </Typography>
                      </Box>

                      {/* Destination */}
                      <Box sx={{ minWidth: 90, textAlign: 'right' }}>
                        <Typography variant="h6" fontWeight={800} color="text.primary">
                          {formatTime(trip.arrivalTime)}
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="text.secondary">
                          {trip.destinationCity}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Bottom Row: Date, Available Seats & Booking CTA */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 1 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <EventIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(trip.departureTime)}
                          </Typography>
                        </Stack>
                        <Chip
                          label={`${trip.availableSeats} seats left`}
                          size="small"
                          color={trip.availableSeats > 5 ? 'success' : 'warning'}
                          sx={{ fontWeight: 700, height: 22, fontSize: '0.7rem' }}
                        />
                      </Stack>

                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/book/${trip.tripId}`)}
                        sx={{ px: 2.5, py: 0.8, fontWeight: 700, borderRadius: 2 }}
                      >
                        Select Seats
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Home;
