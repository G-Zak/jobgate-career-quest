import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadUserProfile, saveUserProfile, defaultUserProfile } from '../utils/profileUtils';

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

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = () => {
            try {
                const userProfile = loadUserProfile();
                if (userProfile && userProfile.id) {
                    setUser(userProfile);
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

            // Simulate API call - in real app, this would call your backend
            // For now, we'll create a user profile based on email
            const userProfile = {
                ...defaultUserProfile,
                id: Date.now(), // Generate unique ID
                email: email,
                name: email.split('@')[0], // Use email prefix as name
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Save user profile
            saveUserProfile(userProfile);

            setUser(userProfile);
            setIsAuthenticated(true);

            return { success: true, user: userProfile };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            setLoading(true);

            // Create new user profile with the provided data
            const userProfile = {
                ...defaultUserProfile,
                id: Date.now(), // Generate unique ID
                name: userData.name || userData.email.split('@')[0],
                email: userData.email,
                contact: {
                    ...defaultUserProfile.contact,
                    email: userData.email,
                    location: userData.location || ''
                },
                // Initialize with empty arrays for professional data
                skills: [],
                skillsWithProficiency: [],
                education: [],
                experience: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Save user profile
            saveUserProfile(userProfile);

            setUser(userProfile);
            setIsAuthenticated(true);

            return { success: true, user: userProfile };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        try {
            // Clear all user data from localStorage
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('userProfile_') || key === 'savedJobs') {
                    localStorage.removeItem(key);
                }
            });

            setUser(null);
            setIsAuthenticated(false);

            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    };

    // Update user profile
    const updateUser = (updatedUser) => {
        try {
            const newUser = { ...user, ...updatedUser, updatedAt: new Date().toISOString() };
            saveUserProfile(newUser);
            setUser(newUser);


            return { success: true, user: newUser };
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
