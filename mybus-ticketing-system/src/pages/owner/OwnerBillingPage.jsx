import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const OwnerBillingPage = () => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/owner/billing/summary');
      if (res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load billing metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInvoice = (tx) => {
    setSelectedInvoice(tx);
    setInvoiceModalOpen(true);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const avgBookingValue =
    summary && summary.confirmedBookings > 0
      ? Number(summary.totalRevenue) / summary.confirmedBookings
      : 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4, pb: 10 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/owner/dashboard')} sx={{ mb: 1 }}>
            Back to Dashboard
          </Button>
          <Typography variant="h4" fontWeight={800}>
            Billing & Documentation Hub
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aggregated revenue records, official invoices, and transaction reconciliation.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<PrintIcon />}
          onClick={handlePrintInvoice}
          sx={{ fontWeight: 700 }}
        >
          Print Billing Statement
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Aggregate Financial Highlights */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Revenue Realized
            </Typography>
            <Typography variant="h4" fontWeight={900} color="primary.main" sx={{ my: 1 }}>
              LKR {Number(summary?.totalRevenue || 0).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="success.main" fontWeight={700}>
              ✓ 100% Processed & Reconciled
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Confirmed Invoices
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ my: 1 }}>
              {summary?.confirmedBookings || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Out of {summary?.totalBookings || 0} initiated orders
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Average Order Value
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ my: 1 }}>
              LKR {Math.round(avgBookingValue).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Per booking transaction
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Passengers Billed
            </Typography>
            <Typography variant="h4" fontWeight={800} color="secondary.main" sx={{ my: 1 }}>
              {summary?.totalPassengers || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              E-Tickets issued across network
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Transaction & Invoice Ledger */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', p: 3 }}>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
          Official Billing Ledger & Tax Invoices
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 700 }}>Invoice / Ref #</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date & Time</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Payment Txn</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Route</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Seats</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Gross Total</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Document Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary?.recentTransactions?.map((tx) => (
                <TableRow key={tx.bookingId} hover>
                  <TableCell sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
                    {tx.bookingReference}
                  </TableCell>
                  <TableCell>
                    {new Date(tx.bookedAt).toLocaleString([], {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </TableCell>
                  <TableCell>{tx.userFullName}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {tx.transactionReference || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {tx.originCity} → {tx.destinationCity}
                  </TableCell>
                  <TableCell>{tx.tickets?.length || 0}</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>
                    LKR {Number(tx.totalAmount).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<ReceiptLongIcon />}
                      onClick={() => handleOpenInvoice(tx)}
                      sx={{ fontWeight: 700 }}
                    >
                      View Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Tax Invoice Modal */}
      <Dialog
        open={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
          },
        }}
      >
        {selectedInvoice && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" fontWeight={900} color="primary.main">
                  TAX INVOICE / RECEIPT
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  mybus Electronic Ticketing Private Ltd.
                </Typography>
              </Box>
              <Chip label="PAID" color="success" size="small" sx={{ fontWeight: 900 }} />
            </DialogTitle>

            <DialogContent dividers>
              {/* Invoice Metadata */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    BILLED TO:
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={800}>
                    {selectedInvoice.userFullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: {selectedInvoice.userEmail}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phone: {selectedInvoice.userPhone}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="text.secondary">
                    INVOICE REFERENCE:
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ fontFamily: 'monospace' }}>
                    INV-{selectedInvoice.bookingReference}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date(selectedInvoice.bookedAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Txn Ref: {selectedInvoice.transactionReference}
                  </Typography>
                </Grid>
              </Grid>

              {/* Journey details */}
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  Journey: {selectedInvoice.originCity} ({selectedInvoice.originStationName}) →{' '}
                  {selectedInvoice.destinationCity} ({selectedInvoice.destinationStationName})
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Operator: {selectedInvoice.operatorName} • Bus Registration:{' '}
                  {selectedInvoice.busRegistrationNumber}
                </Typography>
              </Box>

              {/* Items Table */}
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Passenger</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Seat Allocated</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Deck</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Unit Fare</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedInvoice.tickets?.map((t) => (
                    <TableRow key={t.ticketId}>
                      <TableCell>{t.passengerName}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{t.seatNumber}</TableCell>
                      <TableCell>{t.deck}</TableCell>
                      <TableCell sx={{ textAlign: 'right', fontWeight: 700 }}>
                        LKR {Number(t.fareAmount).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ width: 250 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Subtotal
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      LKR {Number(selectedInvoice.totalAmount).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Taxes & Terminal Levy
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      LKR 0.00
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight={800}>
                      Total Amount
                    </Typography>
                    <Typography variant="h6" fontWeight={900} color="primary.main">
                      LKR {Number(selectedInvoice.totalAmount).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setInvoiceModalOpen(false)}>Close</Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PrintIcon />}
                onClick={() => {
                  setInvoiceModalOpen(false);
                  navigate(`/ticket/${selectedInvoice.bookingReference}`);
                }}
              >
                Go to Printable Ticket
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default OwnerBillingPage;
