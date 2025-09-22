import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (isAuthenticated) {
                // Redirect to dashboard if user is authenticated
                navigate('/dashboard');
            } else {
                // Redirect to login if user is not authenticated
                navigate('/login');
            }
        }
    }, [isAuthenticated, loading, navigate]);

    // Show loading while determining where to redirect
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
            </div>
        </div>
    );
};

export default HomePage;
