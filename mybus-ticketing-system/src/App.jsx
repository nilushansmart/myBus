import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme/theme';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/common/Navbar';
import BottomNav from './components/common/BottomNav';
import NotificationDrawer from './components/common/NotificationDrawer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TripSeatsPage from './pages/TripSeatsPage';
import CheckoutPage from './pages/CheckoutPage';
import TicketPage from './pages/TicketPage';
import MyBookingsPage from './pages/MyBookingsPage';
import StaffCheckinPage from './pages/staff/StaffCheckinPage';
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import OwnerFleetPage from './pages/owner/OwnerFleetPage';
import OwnerRoutesPage from './pages/owner/OwnerRoutesPage';
import OwnerStaffPage from './pages/owner/OwnerStaffPage';
import OwnerBillingPage from './pages/owner/OwnerBillingPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar />
              <NotificationDrawer />
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/trips/:tripId/seats" element={<TripSeatsPage />} />
                  <Route path="/ticket/:bookingRef" element={<TicketPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />

                  {/* Passenger Protected Routes */}
                  <Route
                    path="/checkout/:tripId"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_PASSENGER', 'ROLE_OWNER']}>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-bookings"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_PASSENGER', 'ROLE_OWNER']}>
                        <MyBookingsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Staff Protected Routes */}
                  <Route
                    path="/staff/checkin"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_STAFF', 'ROLE_OWNER']}>
                        <StaffCheckinPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Owner Protected Routes */}
                  <Route
                    path="/owner/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_OWNER']}>
                        <OwnerDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/owner/fleet"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_OWNER']}>
                        <OwnerFleetPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/owner/routes"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_OWNER']}>
                        <OwnerRoutesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/owner/staff"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_OWNER']}>
                        <OwnerStaffPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/owner/billing"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_OWNER']}>
                        <OwnerBillingPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
              <BottomNav />
            </Box>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
