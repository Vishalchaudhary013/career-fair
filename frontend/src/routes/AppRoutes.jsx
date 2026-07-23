import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Child components
import Login from '../components/auth/Login';
import Registration from '../components/auth/Registration';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import SuperAdminDashboard from '../components/pages/SuperAdminDashboard';
import AdminDashboard from '../components/pages/AdminDashboard';
import HallTicketPdf from '../components/pdf/HallTicketPdf';
import StudentDetailList from '../components/superadmins/StudentDetailList';

import EventPage from '../components/pages/EventPage';
import BookingPage from '../components/pages/BookingPage';
import AttendeeDetailsPage from '../components/pages/AttendeeDetailsPage';
import BookingSuccessPage from '../components/pages/BookingSuccessPage';
import RegistrationFormCont from '../components/forms/RegistrationFormCont';
import Home from '../components/pages/Home';
import CreateEventPage from '../components/pages/CreateEventPage';
import AllEventsPage from '../components/pages/AllEventsPage';
import EventCalendarPage from '../components/pages/EventCalendarPage';
import EmployerDashboard from '../components/pages/EmployerDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Registration />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/events" element={<AllEventsPage />} />
      <Route path="/calendar" element={<EventCalendarPage />} />
      <Route path="/event/:id" element={<EventPage />} />
      
      <Route path="/event/:id/book" element={<BookingPage />} />
      <Route path="/event/:id/attendee-details" element={<AttendeeDetailsPage />} />
      <Route path="/event/:eventId/booking-success/:bookingId" element={<BookingSuccessPage />} />
      <Route path="/jobfair/:jobFairId/register" element={<RegistrationFormCont />} />
      
      {/* Protected Routes */}
      <Route 
        path="/employer-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/super-admin-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-dashboard" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-dashboard/:id" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-event" 
        element={
          <ProtectedRoute>
            <CreateEventPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/edit-event/:eventId" 
        element={
          <ProtectedRoute>
            <CreateEventPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/hallTicketPdf" 
        element={
          <ProtectedRoute>
            <HallTicketPdf />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/studentDetailList/:jobFairId" 
        element={
          <ProtectedRoute>
            <StudentDetailList />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
