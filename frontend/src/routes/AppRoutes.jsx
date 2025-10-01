import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import JobListingsPage from '../pages/JobListingsPage';

// Import your existing pages
import MainDashboard from '../shared/components/layout/MainDashboard';
import CleanProfilePage from '../features/profile/components/CleanProfilePage';
import JobRecommendationsPage from '../features/job-recommendations/components/JobRecommendationsPage';
import TestApiPage from '../pages/TestApiPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
 const { isAuthenticated, loading } = useAuth();

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

 return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (for login/register)
const PublicRoute = ({ children }) => {
 const { isAuthenticated, loading } = useAuth();

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

 return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
 return (
 <Routes>
 {/* Public routes */}
 <Route path="/login" element={
 <PublicRoute>
 <LoginPage />
 </PublicRoute>
 } />
 <Route path="/register" element={
 <PublicRoute>
 <RegisterPage />
 </PublicRoute>
 } />

 {/* Home route - handles its own redirects */}
 <Route path="/" element={<HomePage />} />
 <Route path="/dashboard" element={
 <ProtectedRoute>
 <MainDashboard />
 </ProtectedRoute>
 } />
 <Route path="/profile" element={
 <ProtectedRoute>
 <CleanProfilePage />
 </ProtectedRoute>
 } />
 <Route path="/jobs" element={
 <ProtectedRoute>
 <JobRecommendationsPage />
 </ProtectedRoute>
 } />
 <Route path="/all-jobs" element={
 <ProtectedRoute>
 <JobListingsPage />
 </ProtectedRoute>
 } />
 <Route path="/test-api" element={<TestApiPage />} />

 {/* Catch all route */}
 <Route path="*" element={<Navigate to="/" replace />} />
 </Routes>
 );
};

export default AppRoutes;
