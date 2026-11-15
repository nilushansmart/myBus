import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PrintIcon from '@mui/icons-material/Print';
import CancelIcon from '@mui/icons-material/Cancel';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useNotification } from '../context/NotificationContext';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { showToast, addNotification } = useNotification();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingRef, setCancellingRef] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/passenger/bookings');
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (reference) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${reference}? Seats will be released.`)) {
      return;
    }

    try {
      setCancellingRef(reference);
      const res = await api.post(`/passenger/bookings/${reference}/cancel`);
      if (res.success) {
        addNotification('Booking Cancelled', `Booking ${reference} has been successfully cancelled`, 'warning');
        fetchBookings();
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel booking', 'error');
    } finally {
      setCancellingRef(null);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          My Bus Bookings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track upcoming journeys, view digital tickets, and manage reservations.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : bookings.length === 0 ? (
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
          <ConfirmationNumberIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
          <Typography variant="h6" fontWeight={700} gutterBottom>
            No bookings found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You haven't made any bus reservations yet.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/')}>
            Explore Available Routes
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {bookings.map((b) => (
            <Card
              key={b.bookingId}
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  borderColor: 'primary.light',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DirectionsBusIcon color="primary" fontSize="small" />
                      <Typography variant="h6" fontWeight={800}>
                        {b.originCity} → {b.destinationCity}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {b.operatorName} • {b.busClass?.replace(/_/g, ' ')} ({b.busRegistrationNumber})
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Ref: <strong>{b.bookingReference}</strong>
                    </Typography>
                    <Chip
                      label={b.bookingStatus.toUpperCase()}
                      color={b.bookingStatus === 'confirmed' ? 'success' : 'error'}
                      size="small"
                      sx={{ fontWeight: 800, mt: 0.5 }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Departure Date & Time
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {new Date(b.departureTime).toLocaleString([], {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Reserved Seats
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {b.tickets?.map((t) => t.seatNumber).join(', ') || 'N/A'} (
                      {b.tickets?.length || 0} Seat{b.tickets?.length === 1 ? '' : 's'})
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                    <Typography variant="caption" color="text.secondary">
                      Total Fare
                    </Typography>
                    <Typography variant="h6" fontWeight={800} color="primary.main">
                      LKR {Number(b.totalAmount).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1.5,
                    mt: 2.5,
                    pt: 2,
                    borderTop: '1px solid #f1f5f9',
                    flexWrap: 'wrap',
                  }}
                >
                  {b.bookingStatus === 'confirmed' && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<CancelIcon />}
                      disabled={cancellingRef === b.bookingReference}
                      onClick={() => handleCancelBooking(b.bookingReference)}
                    >
                      {cancellingRef === b.bookingReference ? 'Cancelling...' : 'Cancel Booking'}
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<PrintIcon />}
                    onClick={() => navigate(`/ticket/${b.bookingReference}`)}
                    sx={{ fontWeight: 700 }}
                  >
                    View & Print Ticket
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default MyBookingsPage;
