import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true }) => {
 const { isAuthenticated, loading } = useAuth();
 const location = useLocation();

 // Show loading spinner while checking authentication
 if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
 <div className="flex flex-col items-center">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
 <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
 </div>
 </div>
 );
 }

 // If route requires authentication but user is not authenticated
 if (requireAuth && !isAuthenticated) {
 return <Navigate to="/login" state={{ from: location }} replace />;
 }

 // If route doesn't require authentication but user is authenticated (like login/register pages)
 if (!requireAuth && isAuthenticated) {
 return <Navigate to="/" replace />;
 }

 return children;
};

export default ProtectedRoute;
