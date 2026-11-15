import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const TripSeatsPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useNotification();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDeck, setSelectedDeck] = useState('lower');
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [locking, setLocking] = useState(false);

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/public/trips/${tripId}/seats`);
      if (res.success) {
        setTrip(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load trip seat inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked') {
      showToast(`Seat ${seat.seatNumber} is already booked`, 'warning');
      return;
    }
    if (seat.status === 'locked') {
      showToast(`Seat ${seat.seatNumber} is currently held by another passenger`, 'warning');
      return;
    }

    if (selectedSeatIds.includes(seat.seatId)) {
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seat.seatId));
    } else {
      if (selectedSeatIds.length >= 6) {
        showToast('Maximum 6 seats per booking allowed', 'warning');
        return;
      }
      setSelectedSeatIds((prev) => [...prev, seat.seatId]);
    }
  };

  const handleProceedToCheckout = async () => {
    if (selectedSeatIds.length === 0) {
      showToast('Please select at least one seat to continue', 'warning');
      return;
    }

    if (!isAuthenticated) {
      showToast('Please sign in to complete your booking', 'info');
      navigate('/login', { state: { from: { pathname: `/trips/${tripId}/seats` } } });
      return;
    }

    try {
      setLocking(true);
      // Call backend to lock seats
      await api.post('/passenger/seats/lock', {
        tripId: Number(tripId),
        seatIds: selectedSeatIds,
      });

      // Navigate to checkout passing state
      navigate(`/checkout/${tripId}`, {
        state: {
          trip,
          selectedSeatIds,
        },
      });
    } catch (err) {
      showToast(err.message || 'Failed to lock seats', 'error');
      fetchTripDetails(); // Refresh to get current status
    } finally {
      setLocking(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!trip) {
    return (
      <Container maxWidth="sm" sx={{ py: 6, textAlign: 'center' }}>
        <Alert severity="error">Trip information not found</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/')}>
          Back to Search
        </Button>
      </Container>
    );
  }

  const seatsOnDeck = (trip.seats || []).filter((s) => s.deck === selectedDeck);
  const hasUpperDeck = (trip.seats || []).some((s) => s.deck === 'upper');

  // Compute maximum rows & columns
  const maxRow = Math.max(...seatsOnDeck.map((s) => s.rowIndex), 1);
  const maxCol = Math.max(...seatsOnDeck.map((s) => s.colIndex), 4);

  // Group seats by row
  const rows = [];
  for (let r = 1; r <= maxRow; r++) {
    const rowSeats = seatsOnDeck.filter((s) => s.rowIndex === r);
    rows.push(rowSeats);
  }

  const selectedSeatsData = (trip.seats || []).filter((s) => selectedSeatIds.includes(s.seatId));
  const totalPrice = selectedSeatIds.length * Number(trip.baseFare);

  return (
    <Box sx={{ pb: { xs: 16, sm: 12 } }}>
      {/* Top Trip Summary Bar */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'primary.dark',
          color: '#fff',
          py: 2,
          px: { xs: 2, sm: 4 },
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <IconButton
              onClick={() => navigate('/')}
              sx={{ color: '#fff', p: 0.5, bgcolor: 'rgba(255,255,255,0.1)' }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                {trip.originCity} → {trip.destinationCity}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {trip.operatorName} • {trip.busClass.replace(/_/g, ' ')} ({trip.registrationNumber})
              </Typography>
            </Box>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="md" sx={{ mt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Legend */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            bgcolor: '#fff',
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                border: '2px solid #cbd5e1',
                bgcolor: '#fff',
              }}
            />
            <Typography variant="caption" fontWeight={600}>
              Available
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                bgcolor: 'secondary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography variant="caption" fontWeight={600}>
              Selected
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                bgcolor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
              }}
            >
              <LockIcon sx={{ fontSize: 14 }} />
            </Box>
            <Typography variant="caption" fontWeight={600}>
              Booked
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                border: '2px solid #f59e0b',
                bgcolor: '#fef3c7',
              }}
            />
            <Typography variant="caption" fontWeight={600}>
              Locked
            </Typography>
          </Box>
        </Paper>

        {/* Deck Tabs (if upper deck exists) */}
        {hasUpperDeck && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Tabs
              value={selectedDeck}
              onChange={(e, val) => setSelectedDeck(val)}
              textColor="primary"
              indicatorColor="primary"
              sx={{ bgcolor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', p: 0.5 }}
            >
              <Tab label="Lower Deck" value="lower" sx={{ fontWeight: 700 }} />
              <Tab label="Upper Deck" value="upper" sx={{ fontWeight: 700 }} />
            </Tabs>
          </Box>
        )}

        {/* Bus Cabin Interior Representation */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 4,
            border: '2px solid #e2e8f0',
            bgcolor: '#ffffff',
            maxWidth: 440,
            mx: 'auto',
            position: 'relative',
          }}
        >
          {/* Driver Cabin Indicator */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pb: 2,
              mb: 3,
              borderBottom: '2px dashed #e2e8f0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsBusIcon color="action" />
              <Typography variant="caption" fontWeight={700} color="text.secondary">
                FRONT / DRIVER CABIN
              </Typography>
            </Box>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              🚗
            </Box>
          </Box>

          {/* Seat Grid Layout */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
            {rows.map((rowSeats, rIdx) => (
              <Box
                key={rIdx}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {/* Left Side Seats (Col 1, 2) */}
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  {rowSeats
                    .filter((s) => s.colIndex <= 2)
                    .map((seat) => renderSeatButton(seat))}
                </Box>

                {/* Aisle Spacer */}
                <Box
                  sx={{
                    width: 32,
                    textAlign: 'center',
                    color: '#cbd5e1',
                    fontSize: 12,
                    userSelect: 'none',
                  }}
                >
                  │
                </Box>

                {/* Right Side Seats (Col 3, 4) */}
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  {rowSeats
                    .filter((s) => s.colIndex > 2)
                    .map((seat) => renderSeatButton(seat))}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Back of bus */}
          <Box sx={{ textAlign: 'center', pt: 3, mt: 3, borderTop: '2px dashed #e2e8f0' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              REAR OF BUS
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Floating Bottom Sticky Checkout Bar */}
      <Paper
        elevation={4}
        className="no-print"
        sx={{
          position: 'fixed',
          bottom: { xs: 56, md: 0 },
          left: 0,
          right: 0,
          zIndex: 999,
          p: 2,
          bgcolor: '#fff',
          borderTop: '1px solid #e2e8f0',
          boxShadow: '0 -6px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Selected: <strong>{selectedSeatIds.length} seat(s)</strong>{' '}
                {selectedSeatsData.length > 0 &&
                  `(${selectedSeatsData.map((s) => s.seatNumber).join(', ')})`}
              </Typography>
              <Typography variant="h6" fontWeight={800} color="primary.main">
                LKR {totalPrice.toLocaleString()}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={selectedSeatIds.length === 0 || locking}
              onClick={handleProceedToCheckout}
              endIcon={locking ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardIcon />}
              sx={{
                px: { xs: 2.5, sm: 4 },
                py: 1.2,
                fontWeight: 700,
                borderRadius: 3,
              }}
            >
              {locking ? 'Holding Seats...' : 'Proceed to Book'}
            </Button>
          </Box>
        </Container>
      </Paper>
    </Box>
  );

  function renderSeatButton(seat) {
    const isSelected = selectedSeatIds.includes(seat.seatId);
    const isBooked = seat.status === 'booked';
    const isLocked = seat.status === 'locked';

    let bgColor = '#fff';
    let borderColor = '#cbd5e1';
    let textColor = '#1e293b';

    if (isSelected) {
      bgColor = '#06b6d4';
      borderColor = '#0891b2';
      textColor = '#fff';
    } else if (isBooked) {
      bgColor = '#f1f5f9';
      borderColor = '#e2e8f0';
      textColor = '#94a3b8';
    } else if (isLocked) {
      bgColor = '#fef3c7';
      borderColor = '#f59e0b';
      textColor = '#b45309';
    }

    return (
      <Box
        key={seat.seatId}
        onClick={() => handleSeatClick(seat)}
        sx={{
          width: { xs: 44, sm: 50 },
          height: { xs: 44, sm: 50 },
          borderRadius: 2,
          border: `2px solid ${borderColor}`,
          bgcolor: bgColor,
          color: textColor,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isBooked ? 'not-allowed' : 'pointer',
          userSelect: 'none',
          transition: 'all 0.15s ease',
          boxShadow: isSelected ? '0 4px 12px rgba(6, 182, 212, 0.35)' : 'none',
          transform: isSelected ? 'scale(1.05)' : 'none',
          '&:hover': {
            transform: !isBooked ? 'scale(1.06)' : 'none',
          },
        }}
      >
        <EventSeatIcon sx={{ fontSize: 18 }} />
        <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.65rem', lineHeight: 1 }}>
          {seat.seatNumber}
        </Typography>
      </Box>
    );
  }
};

export default TripSeatsPage;
