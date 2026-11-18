import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

export const RoleRoute = ({ role, children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="lg" label="Checking permissions..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={role === 'ADMIN' ? '/auth/admin/login' : '/auth/login'} replace />;
  }

  if (user?.role !== role) {
    // If applicant tries to access admin or vice versa, redirect to respective dashboard
    return <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/applicant/dashboard'} replace />;
  }

  return children;
};

export default RoleRoute;
