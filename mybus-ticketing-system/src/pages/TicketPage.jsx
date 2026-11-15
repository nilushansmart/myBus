import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Divider,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

const TicketPage = () => {
  const { bookingRef } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingRef]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/passenger/bookings/${bookingRef}`);
      if (res.success) {
        setBooking(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error || !booking) {
    return (
      <Container maxWidth="sm" sx={{ py: 6, textAlign: 'center' }}>
        <Alert severity="error">{error || 'Booking record not found'}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/')}>
          Return Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 }, pb: 10 }}>
      {/* Action Header - Hidden during print */}
      <Box
        className="no-print"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/my-bookings')}>
          Back to Bookings
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ fontWeight: 700, px: 3 }}
        >
          Print Ticket / Save PDF
        </Button>
      </Box>

      {/* Main E-Ticket Printable Canvas */}
      <Paper
        elevation={0}
        className="print-area"
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          border: '2px solid #0f172a',
          bgcolor: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          '@media print': {
            border: '2px solid #000 !important',
            p: 3,
            boxShadow: 'none !important',
          },
        }}
      >
        {/* Ticket Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                bgcolor: '#1e3a8a',
                color: '#fff',
                p: 1.2,
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DirectionsBusIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#1e3a8a" sx={{ letterSpacing: '-0.5px' }}>
                my<span style={{ color: '#06b6d4' }}>bus</span> PASSENGER E-TICKET
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                OFFICIAL ELECTRONIC BOARDING PASS
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="caption" color="text.secondary" display="block">
              BOOKING REFERENCE
            </Typography>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ fontFamily: 'monospace', letterSpacing: 1.5, color: '#0f172a' }}
            >
              {booking.bookingReference}
            </Typography>
            <Chip
              label={booking.bookingStatus.toUpperCase()}
              color={booking.bookingStatus === 'confirmed' ? 'success' : 'error'}
              size="small"
              sx={{ fontWeight: 800, mt: 0.5 }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2.5, borderStyle: 'dashed', borderColor: '#cbd5e1' }} />

        {/* Journey Details Grid */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              ORIGIN DEPARTURE
            </Typography>
            <Typography variant="h5" fontWeight={800} color="#0f172a">
              {booking.originCity}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {booking.originStationName}
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} color="primary.main" sx={{ mt: 1 }}>
              {new Date(booking.departureTime).toLocaleString([], {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              DESTINATION ARRIVAL
            </Typography>
            <Typography variant="h5" fontWeight={800} color="#0f172a">
              {booking.destinationCity}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {booking.destinationStationName}
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} color="primary.main" sx={{ mt: 1 }}>
              {new Date(booking.arrivalTime).toLocaleString([], {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </Typography>
          </Grid>
        </Grid>

        {/* Vehicle & Operator Info */}
        <Box
          sx={{
            p: 2,
            bgcolor: '#f8fafc',
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              OPERATOR
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {booking.operatorName}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              BUS REGISTRATION
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {booking.busRegistrationNumber}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              CLASS / SERVICE
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {booking.busClass?.replace(/_/g, ' ')}
            </Typography>
          </Box>
        </Box>

        {/* Passengers & Seat Assignments */}
        <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1.5, letterSpacing: 0.5 }}>
          PASSENGER & SEAT ASSIGNMENTS
        </Typography>

        <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
          {booking.tickets?.map((t, idx) => (
            <Box
              key={t.ticketId}
              sx={{
                p: 1.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: idx < booking.tickets.length - 1 ? '1px solid #e2e8f0' : 'none',
                bgcolor: idx % 2 === 0 ? '#fff' : '#f8fafc',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    color: '#fff',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1.5,
                    fontWeight: 800,
                    fontSize: '0.85rem',
                  }}
                >
                  SEAT {t.seatNumber}
                </Box>
                <Box>
                  <Typography variant="body1" fontWeight={700}>
                    {t.passengerName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Age {t.passengerAge} • {t.passengerGender.toUpperCase()} • Deck: {t.deck}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" fontWeight={700}>
                  LKR {Number(t.fareAmount).toLocaleString()}
                </Typography>
                <Chip
                  label={t.isCheckedIn ? 'Checked-In' : 'Pending Check-In'}
                  color={t.isCheckedIn ? 'success' : 'default'}
                  size="small"
                  sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
                />
              </Box>
            </Box>
          ))}
        </Box>

        {/* Total & Payment Summary */}
        <Divider sx={{ my: 2.5, borderStyle: 'dashed', borderColor: '#cbd5e1' }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* Simulated QR & Barcode */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                p: 1,
                border: '1px solid #cbd5e1',
                borderRadius: 2,
                bgcolor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <QrCode2Icon sx={{ fontSize: 56, color: '#0f172a' }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                TXN REF: {booking.transactionReference || 'PAID-DIRECT'}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                BOOKED ON: {new Date(booking.bookedAt).toLocaleDateString()}
              </Typography>
              <Typography variant="caption" color="success.main" fontWeight={700}>
                ● PAYMENT STATUS: SUCCESSFUL
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="caption" color="text.secondary" display="block">
              TOTAL AMOUNT PAID
            </Typography>
            <Typography variant="h4" fontWeight={900} color="#1e3a8a">
              LKR {Number(booking.totalAmount).toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* Instructions */}
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #f1f5f9' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic' }}>
            * Present this printed electronic ticket or show the digital version on your mobile phone to the bus conductor before boarding. Please report to the departure bay at least 15 minutes prior to scheduled departure.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TicketPage;
