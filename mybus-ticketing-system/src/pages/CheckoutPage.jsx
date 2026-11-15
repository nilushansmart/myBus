import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const CheckoutPage = () => {
  const { tripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification, showToast } = useNotification();

  const trip = location.state?.trip;
  const selectedSeatIds = location.state?.selectedSeatIds || [];

  const [passengers, setPassengers] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CreditCard');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!trip || selectedSeatIds.length === 0) {
      navigate('/');
      return;
    }

    // Initialize passenger details for each seat
    const initialPassengers = selectedSeatIds.map((seatId, idx) => {
      const seatObj = trip.seats?.find((s) => s.seatId === seatId);
      return {
        seatId,
        seatNumber: seatObj ? seatObj.seatNumber : `#${seatId}`,
        passengerName: idx === 0 ? user?.fullName || '' : '',
        passengerAge: idx === 0 ? 30 : '',
        passengerGender: 'male',
      };
    });
    setPassengers(initialPassengers);
  }, [trip, selectedSeatIds, user]);

  const handlePassengerChange = (index, field, value) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].passengerName.trim()) {
        setError(`Please enter the name for Seat ${passengers[i].seatNumber}`);
        return;
      }
      if (!passengers[i].passengerAge || Number(passengers[i].passengerAge) <= 0) {
        setError(`Please enter a valid age for Seat ${passengers[i].seatNumber}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        tripId: Number(tripId),
        paymentMethod,
        passengers: passengers.map((p) => ({
          seatId: p.seatId,
          passengerName: p.passengerName,
          passengerAge: Number(p.passengerAge),
          passengerGender: p.passengerGender,
        })),
      };

      const res = await api.post('/passenger/bookings', payload);
      if (res.success && res.data) {
        addNotification(
          'Booking Confirmed!',
          `Booking Ref ${res.data.bookingReference} for ${res.data.originCity} → ${res.data.destinationCity}`,
          'success'
        );
        navigate(`/ticket/${res.data.bookingReference}`);
      }
    } catch (err) {
      setError(err.message || 'Booking submission failed. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!trip) return null;

  const totalFare = passengers.length * Number(trip.baseFare);

  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/trips/${tripId}/seats`)}
        sx={{ mb: 2 }}
      >
        Back to Seat Matrix
      </Button>

      <Typography variant="h4" fontWeight={800} gutterBottom>
        Passenger Details & Checkout
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Complete passenger information to issue your electronic boarding passes.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column: Passenger Info Forms */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box component="form" onSubmit={handleSubmitBooking}>
            {passengers.map((p, idx) => (
              <Card
                key={p.seatId}
                elevation={0}
                sx={{
                  mb: 2.5,
                  p: 2,
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  bgcolor: '#fff',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight={700}>
                    Passenger {idx + 1}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    sx={{ py: 0.2, px: 1, minWidth: 'auto', ml: 'auto', fontWeight: 700 }}
                  >
                    Seat {p.seatNumber}
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      label="Full Name"
                      value={p.passengerName}
                      onChange={(e) => handlePassengerChange(idx, 'passengerName', e.target.value)}
                    />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      type="number"
                      label="Age"
                      value={p.passengerAge}
                      onChange={(e) => handlePassengerChange(idx, 'passengerAge', e.target.value)}
                    />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Gender"
                      value={p.passengerGender}
                      onChange={(e) => handlePassengerChange(idx, 'passengerGender', e.target.value)}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Card>
            ))}

            {/* Payment Method Selector */}
            <Card
              elevation={0}
              sx={{
                p: 2.5,
                mb: 3,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                bgcolor: '#fff',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <PaymentIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={700}>
                  Payment Gateway
                </Typography>
              </Box>

              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="CreditCard"
                  control={<Radio />}
                  label="💳 Visa / MasterCard (Instant Confirmation)"
                />
                <FormControlLabel
                  value="GeniePay"
                  control={<Radio />}
                  label="📱 Dialog Genie / FriMi QR"
                />
                <FormControlLabel
                  value="Cash"
                  control={<Radio />}
                  label="💵 Cash on Boarding (Pay to Conductor)"
                />
              </RadioGroup>
            </Card>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={submitting}
              startIcon={
                submitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CheckCircleIcon />
                )
              }
              sx={{ py: 1.5, fontWeight: 700, borderRadius: 3 }}
            >
              {submitting ? 'Confirming & Issuing Tickets...' : `Pay & Confirm (LKR ${totalFare.toLocaleString()})`}
            </Button>
          </Box>
        </Grid>

        {/* Right Column: Order Summary */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              bgcolor: '#f8fafc',
              position: 'sticky',
              top: 80,
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Trip Summary
            </Typography>
            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Route
              </Typography>
              <Typography variant="subtitle1" fontWeight={700}>
                {trip.originCity} → {trip.destinationCity}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {trip.operatorName} • {trip.busClass.replace(/_/g, ' ')}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Departure Time
              </Typography>
              <Typography variant="subtitle2" fontWeight={600}>
                {new Date(trip.departureTime).toLocaleString()}
              </Typography>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Base Fare per Seat
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                LKR {Number(trip.baseFare).toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Total Seats
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {passengers.length}
              </Typography>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={800}>
                Total Payable
              </Typography>
              <Typography variant="h5" fontWeight={800} color="primary.main">
                LKR {totalFare.toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
