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
  Stack,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonIcon from '@mui/icons-material/Person';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
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
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 14 }}>
        <CircularProgress color="primary" size={48} />
      </Box>
    );
  }

  if (error || !booking) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ borderRadius: 3, mb: 3 }}>
          {error || 'Booking record not found'}
        </Alert>
        <Button variant="outlined" sx={{ borderRadius: 2.5, px: 3 }} onClick={() => navigate('/')}>
          Return Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6, md: 8 }, pb: 14 }}>
      {/* Action Header Bar - Hidden during print */}
      <Box
        className="no-print"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            fontWeight: 600,
            color: '#475569',
            textTransform: 'none',
            borderRadius: 2,
            px: 2,
          }}
        >
          Back to Search
        </Button>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{
              fontWeight: 700,
              px: 3.5,
              py: 1.2,
              borderRadius: 2.5,
              textTransform: 'none',
              boxShadow: '0 8px 20px rgba(30, 58, 138, 0.25)',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            }}
          >
            Print Ticket / Save PDF
          </Button>
        </Stack>
      </Box>

      {/* Main E-Ticket Printable Receipt Canvas with Generous Padding */}
      <Paper
        elevation={0}
        className="print-area"
        sx={{
          p: { xs: 3.5, sm: 5.5, md: 7 }, // Generous vertical and horizontal padding
          borderRadius: 4,
          border: '2px solid #1e293b',
          bgcolor: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
          '@media print': {
            border: '2px solid #000 !important',
            p: 4,
            boxShadow: 'none !important',
          },
        }}
      >
        {/* Top Decorative Stripe */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #1e3a8a 0%, #06b6d4 100%)',
          }}
        />

        {/* ==================== 1. TICKET HEADER ==================== */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 4.5,
            flexWrap: 'wrap',
            gap: 2.5,
          }}
        >
          {/* Logo & Subtitle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                bgcolor: '#1e3a8a',
                color: '#ffffff',
                p: 1.5,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(30, 58, 138, 0.3)',
              }}
            >
              <DirectionsBusIcon sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={900} color="#1e3a8a" sx={{ letterSpacing: '-0.5px' }}>
                my<span style={{ color: '#06b6d4' }}>bus</span> PASSENGER E-TICKET
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ letterSpacing: '0.5px' }}>
                OFFICIAL ELECTRONIC BOARDING PASS & FISCAL RECEIPT
              </Typography>
            </Box>
          </Box>

          {/* Booking Reference Stamp */}
          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ letterSpacing: 0.5 }}>
              BOOKING REFERENCE
            </Typography>
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                fontFamily: 'monospace',
                letterSpacing: 2,
                color: '#0f172a',
                my: 0.5,
              }}
            >
              {booking.bookingReference}
            </Typography>
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: '16px !important' }} />}
              label={booking.bookingStatus?.toUpperCase() || 'CONFIRMED'}
              color={booking.bookingStatus === 'confirmed' ? 'success' : 'error'}
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: '0.75rem',
                borderRadius: 2,
                px: 1,
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3.5, borderStyle: 'dashed', borderColor: '#cbd5e1' }} />

        {/* ==================== 2. JOURNEY OVERVIEW CARD ==================== */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 }, // Spacious padding inside journey card
            bgcolor: '#f8fafc',
            borderRadius: 3.5,
            border: '1px solid #e2e8f0',
            mb: 4.5,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            {/* Origin Station */}
            <Grid item xs={12} sm={5}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box
                  sx={{
                    bgcolor: '#eff6ff',
                    color: '#2563eb',
                    p: 1,
                    borderRadius: 2,
                    mt: 0.5,
                  }}
                >
                  <LocationOnIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ letterSpacing: 0.5 }}>
                    DEPARTURE ORIGIN
                  </Typography>
                  <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{ my: 0.3 }}>
                    {booking.originCity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {booking.originStationName}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    fontWeight={800}
                    color="#1e3a8a"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    <AccessTimeIcon fontSize="small" />
                    {new Date(booking.departureTime).toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Travel Arrow / Route Badge */}
            <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Chip
                  label={booking.routeNumber || 'EXPRESS'}
                  size="small"
                  sx={{
                    bgcolor: '#e2e8f0',
                    color: '#334155',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Direct Route
                </Typography>
              </Box>
            </Grid>

            {/* Destination Station */}
            <Grid item xs={12} sm={5}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, justifyContent: { sm: 'flex-end' }, textAlign: { sm: 'right' } }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ letterSpacing: 0.5 }}>
                    ARRIVAL DESTINATION
                  </Typography>
                  <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{ my: 0.3 }}>
                    {booking.destinationCity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {booking.destinationStationName}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    fontWeight={800}
                    color="#1e3a8a"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: { sm: 'flex-end' } }}
                  >
                    <AccessTimeIcon fontSize="small" />
                    {new Date(booking.arrivalTime).toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: '#ecfeff',
                    color: '#0891b2',
                    p: 1,
                    borderRadius: 2,
                    mt: 0.5,
                  }}
                >
                  <LocationOnIcon fontSize="small" />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* ==================== 3. BUS & OPERATOR INFO ==================== */}
        <Box
          sx={{
            p: { xs: 2.5, sm: 3.5 }, // Generous padding
            bgcolor: '#ffffff',
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            mb: 4.5,
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">
                BUS OPERATOR
              </Typography>
              <Typography variant="body1" fontWeight={800} color="#0f172a" sx={{ mt: 0.5 }}>
                {booking.operatorName}
              </Typography>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">
                VEHICLE REGISTRATION
              </Typography>
              <Typography variant="body1" fontWeight={800} color="#1e3a8a" sx={{ mt: 0.5, fontFamily: 'monospace' }}>
                {booking.busRegistrationNumber}
              </Typography>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">
                CLASS & AMENITIES
              </Typography>
              <Typography variant="body1" fontWeight={800} color="#0f172a" sx={{ mt: 0.5 }}>
                {booking.busClass?.replace(/_/g, ' ') || 'AC Luxury'}
              </Typography>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">
                TOTAL SEATS RESERVED
              </Typography>
              <Typography variant="body1" fontWeight={800} color="#10b981" sx={{ mt: 0.5 }}>
                {booking.tickets?.length || 1} Passenger(s)
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* ==================== 4. VERTICAL TICKETS (PADDED TICKET STUBS) ==================== */}
        <Box sx={{ mb: 4.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
            <ConfirmationNumberIcon color="primary" fontSize="small" />
            <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ letterSpacing: '0.2px' }}>
              PASSENGER BOARDING PASSES (VERTICAL TICKETS)
            </Typography>
          </Box>

          <Stack spacing={3}>
            {booking.tickets?.map((t, idx) => (
              <Paper
                key={t.ticketId || idx}
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4.5 }, // Highly padded individual vertical ticket receipt
                  borderRadius: 3.5,
                  border: '1.5px dashed #94a3b8',
                  bgcolor: '#ffffff',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#1e3a8a',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  },
                }}
              >
                {/* Perforated Notched Cutouts on left and right */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: -12,
                    transform: 'translateY(-50%)',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: '#ffffff',
                    borderRight: '1.5px dashed #94a3b8',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: -12,
                    transform: 'translateY(-50%)',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: '#ffffff',
                    borderLeft: '1.5px dashed #94a3b8',
                  }}
                />

                <Grid container spacing={3} alignItems="center">
                  {/* Left Column: Big Seat Pill & Deck Info */}
                  <Grid item xs={12} sm={3}>
                    <Box
                      sx={{
                        p: 2.5,
                        bgcolor: '#eff6ff',
                        borderRadius: 3,
                        textAlign: 'center',
                        border: '1px solid #bfdbfe',
                      }}
                    >
                      <AirlineSeatReclineNormalIcon sx={{ fontSize: 32, color: '#1e3a8a', mb: 0.5 }} />
                      <Typography variant="h4" fontWeight={900} color="#1e3a8a" sx={{ letterSpacing: 0.5 }}>
                        {t.seatNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">
                        DECK: {t.deck?.toUpperCase() || 'LOWER'} • {t.seatType?.toUpperCase() || 'SEATER'}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Middle Column: Passenger Information */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ pl: { sm: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                        <PersonIcon color="action" fontSize="small" />
                        <Typography variant="h6" fontWeight={800} color="#0f172a">
                          {t.passengerName}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, ml: 3.2 }}>
                        Age {t.passengerAge} • Gender: {t.passengerGender?.toUpperCase()} • Ticket #TKT-{t.ticketId}
                      </Typography>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, ml: 3.2 }}>
                        <Chip
                          label={`Boarding: ${t.boardingStationName || booking.originCity}`}
                          size="small"
                          sx={{ bgcolor: '#f1f5f9', fontWeight: 600, fontSize: '0.75rem' }}
                        />
                        <Chip
                          label={`Dropping: ${t.droppingStationName || booking.destinationCity}`}
                          size="small"
                          sx={{ bgcolor: '#f1f5f9', fontWeight: 600, fontSize: '0.75rem' }}
                        />
                      </Box>
                    </Box>
                  </Grid>

                  {/* Right Column: Fare & Conductor QR */}
                  <Grid item xs={12} sm={3} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 1 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>
                        FARE PER SEAT
                      </Typography>
                      <Typography variant="h5" fontWeight={900} color="#1e3a8a">
                        LKR {Number(t.fareAmount || booking.totalAmount).toLocaleString()}
                      </Typography>

                      <Chip
                        icon={<VerifiedIcon sx={{ fontSize: '14px !important' }} />}
                        label={t.isCheckedIn ? 'Checked-In' : 'Ready to Board'}
                        color={t.isCheckedIn ? 'success' : 'primary'}
                        variant={t.isCheckedIn ? 'filled' : 'outlined'}
                        size="small"
                        sx={{ fontWeight: 700, mt: 0.5 }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>
        </Box>

        {/* ==================== 5. TOTAL & PAYMENT SUMMARY ==================== */}
        <Divider sx={{ my: 4, borderStyle: 'dashed', borderColor: '#cbd5e1' }} />

        <Box
          sx={{
            p: { xs: 3.5, sm: 5 }, // Generous padding in payment summary receipt
            bgcolor: '#f8fafc',
            borderRadius: 3.5,
            border: '1px solid #e2e8f0',
            mb: 4,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            {/* Conductor Scanner QR & Verification */}
            <Grid item xs={12} sm={7}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Box
                  sx={{
                    p: 1.5,
                    border: '2px solid #0f172a',
                    borderRadius: 2.5,
                    bgcolor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                >
                  <QrCode2Icon sx={{ fontSize: 68, color: '#0f172a' }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                    DIGITAL VERIFICATION QR
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.3 }}>
                    TRANSACTION ID: {booking.transactionReference || 'TXN-ONLINE-DIRECT'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    DATE ISSUED: {new Date(booking.bookedAt || Date.now()).toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight={800} display="block" sx={{ mt: 0.5 }}>
                    ● PAYMENT CONFIRMED (PAID IN FULL)
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Total Fare Amount */}
            <Grid item xs={12} sm={5} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography variant="caption" color="text.secondary" fontWeight={800} display="block" sx={{ letterSpacing: 0.5 }}>
                TOTAL AMOUNT PAID
              </Typography>
              <Typography variant="h3" fontWeight={900} color="#1e3a8a" sx={{ my: 0.5 }}>
                LKR {Number(booking.totalAmount).toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Includes all highway tolls, transit charges, and seat reservations.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* ==================== 6. PASSENGER BOARDING GUIDELINES ==================== */}
        <Box
          sx={{
            p: 3.5, // Generous padding in notices box
            bgcolor: '#ffffff',
            borderRadius: 3,
            border: '1px solid #f1f5f9',
          }}
        >
          <Typography variant="subtitle2" fontWeight={800} color="#334155" gutterBottom>
            IMPORTANT PASSENGER INSTRUCTIONS
          </Typography>
          <Stack spacing={0.8} sx={{ pl: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              • <strong>Boarding Pass Verification:</strong> Please present this printed electronic ticket or the digital version on your mobile device to the conductor at the boarding bay.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              • <strong>Reporting Time:</strong> Arrive at your designated departure station at least <strong>15 to 20 minutes</strong> prior to the scheduled departure time.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              • <strong>Identification:</strong> A valid national ID card (NIC), driving license, or passport corresponding to the passenger name may be requested for verification.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              • <strong>Assistance & Helplines:</strong> For route delays, seat queries, or refunds, contact 24/7 mybus support hotline at <strong>+94 11 234 5678</strong>.
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default TicketPage;
