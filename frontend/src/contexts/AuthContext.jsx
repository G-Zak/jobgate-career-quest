import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load user from auth service on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const user = authService.getCurrentUser();
                    setUser(user);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            setLoading(true);

            const result = await authService.login(email, password);

            if (result.success) {
                // Refresh user data to ensure it has the name property
                const refreshedUser = authService.refreshUserData();
                setUser(refreshedUser);
                setIsAuthenticated(true);
                return { success: true, user: refreshedUser };
            } else {
                return { success: false, error: result.errors?.general?.[0] || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Login failed. Please try again.' };
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            setLoading(true);

            const result = await authService.register(userData);

            if (result.success) {
                // Refresh user data to ensure it has the name property
                const refreshedUser = authService.refreshUserData();
                setUser(refreshedUser);
                setIsAuthenticated(true);
                return { success: true, user: refreshedUser };
            } else {
                return { success: false, error: result.errors?.general?.[0] || 'Registration failed' };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Registration failed. Please try again.' };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            const result = await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
            return result;
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    };

    // Update user profile
    const updateUser = async (updatedUser) => {
        try {
            const result = await authService.updateProfile(updatedUser);
            if (result) {
                setUser(result.user);
                return { success: true, user: result.user };
            } else {
                return { success: false, error: 'Profile update failed' };
            }
        } catch (error) {
            console.error('Update user error:', error);
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
