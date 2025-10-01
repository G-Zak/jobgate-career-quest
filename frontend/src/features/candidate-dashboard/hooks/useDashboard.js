// Custom hook for candidate dashboard data
// Manages dashboard state and API calls

import { useState, useEffect } from 'react';
import CandidateDashboardService from '../services/dashboardService.js';

export const useCandidateDashboard = (userId) => {
 const [dashboardData, setDashboardData] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 const fetchDashboardData = async () => {
 try {
 setLoading(true);
 setError(null);

 // Fetch all dashboard data in parallel
 const [
 dashboard,
 profile,
 badges,
 testHistory,
 jobRecommendations,
 userSkills
 ] = await Promise.all([
 CandidateDashboardService.getDashboardData(userId),
 CandidateDashboardService.getUserProfile(userId),
 CandidateDashboardService.getUserBadges(userId),
 CandidateDashboardService.getTestHistory(userId),
 CandidateDashboardService.getJobRecommendations(userId),
 CandidateDashboardService.getUserSkills(userId),
 ]);

 setDashboardData({
 ...dashboard,
 profile,
 badges,
 testHistory,
 jobRecommendations,
 userSkills,
 });
 } catch (err) {
 setError(err.message || 'Failed to fetch dashboard data');
 } finally {
 setLoading(false);
 }
 };

 const refreshDashboard = () => {
 fetchDashboardData();
 };

 useEffect(() => {
 if (userId) {
 fetchDashboardData();
 }
 }, [userId]);

 return {
 dashboardData,
 loading,
 error,
 refreshDashboard,
 };
};

// Hook for user profile management
export const useUserProfile = (userId) => {
 const [profile, setProfile] = useState(null);
 const [updating, setUpdating] = useState(false);
 const [error, setError] = useState(null);

 const updateProfile = async (profileData) => {
 try {
 setUpdating(true);
 setError(null);

 const updatedProfile = await CandidateDashboardService.updateProfile(userId, profileData);
 setProfile(updatedProfile);

 return updatedProfile;
 } catch (err) {
 setError(err.message || 'Failed to update profile');
 throw err;
 } finally {
 setUpdating(false);
 }
 };

 return {
 profile,
 updateProfile,
 updating,
 error,
 };
};

export default useCandidateDashboard;
