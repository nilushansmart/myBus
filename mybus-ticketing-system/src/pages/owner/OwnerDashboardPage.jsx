import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import RouteIcon from '@mui/icons-material/Route';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const OwnerDashboardPage = () => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/owner/billing/summary');
      if (res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, pb: 10 }}>
      {/* Top Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Owner Management Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fleet operations, active timetables, revenue streams, and staff administration.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<DirectionsBusIcon />}
            onClick={() => navigate('/owner/fleet')}
          >
            Manage Fleet
          </Button>
          <Button
            variant="outlined"
            startIcon={<RouteIcon />}
            onClick={() => navigate('/owner/routes')}
          >
            Timetables
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ReceiptLongIcon />}
            onClick={() => navigate('/owner/billing')}
            sx={{ fontWeight: 700 }}
          >
            Billing & Invoices Hub
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {/* Total Revenue */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              color: '#fff',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                Total Gross Revenue
              </Typography>
              <MonetizationOnIcon sx={{ color: 'rgba(255,255,255,0.8)' }} />
            </Box>
            <Typography variant="h4" fontWeight={900} sx={{ my: 1 }}>
              LKR {Number(summary?.totalRevenue || 0).toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              From {summary?.confirmedBookings || 0} confirmed bookings
            </Typography>
          </Card>
        </Grid>

        {/* Total Bookings */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Bookings
              </Typography>
              <ConfirmationNumberIcon color="primary" />
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ my: 1 }}>
              {summary?.totalBookings || 0}
            </Typography>
            <Typography variant="caption" color="success.main" fontWeight={700}>
              ● {summary?.confirmedBookings || 0} Confirmed • {summary?.cancelledBookings || 0} Cancelled
            </Typography>
          </Card>
        </Grid>

        {/* Active Fleet */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Registered Fleet
              </Typography>
              <DirectionsBusIcon color="secondary" />
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ my: 1 }}>
              {summary?.totalBuses || 0} Buses
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Across express AC & Sleeper configurations
            </Typography>
          </Card>
        </Grid>

        {/* Total Scheduled Trips */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Scheduled Journeys
              </Typography>
              <RouteIcon color="warning" />
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ my: 1 }}>
              {summary?.totalTrips || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Active routes on timetable
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Bookings & Invoices Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={800}>
            Recent Booking & Ticket Transactions
          </Typography>
          <Button
            size="small"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/owner/billing')}
          >
            Full Invoice Hub
          </Button>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 700 }}>Booking Ref</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Route</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Departure</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Seats</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Amount (LKR)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary?.recentTransactions?.slice(0, 8).map((tx) => (
                <TableRow key={tx.bookingId} hover>
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                    {tx.bookingReference}
                  </TableCell>
                  <TableCell>{tx.userFullName}</TableCell>
                  <TableCell>
                    {tx.originCity} → {tx.destinationCity}
                  </TableCell>
                  <TableCell>
                    {new Date(tx.departureTime).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>{tx.tickets?.length || 0}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {Number(tx.totalAmount).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tx.bookingStatus}
                      color={tx.bookingStatus === 'confirmed' ? 'success' : 'default'}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/ticket/${tx.bookingReference}`)}
                    >
                      View Ticket
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default OwnerDashboardPage;
