import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../components/hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
