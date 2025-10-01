import { useState, useEffect, useCallback } from 'react';
import recommendationApi from '../services/recommendationApi';
import { loadUserProfile } from '../utils/profileUtils';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for managing job recommendations
 */
export const useJobRecommendations = (options = {}) => {
 const {
 limit = 10,
 minScore = 50,
 autoLoad = true,
 refreshInterval = null
 } = options;

 const { user } = useAuth(); // Get current user from auth context
 const [recommendations, setRecommendations] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [userPreferences, setUserPreferences] = useState(null);
 const [skillsAnalysis, setSkillsAnalysis] = useState(null);
 const [userProfile, setUserProfile] = useState(null);

 /**
 * Load user profile - use authenticated user if available, otherwise load from localStorage
 */
 const loadUserProfileData = useCallback(() => {
 // Use authenticated user profile if available, otherwise fallback to localStorage
 const profile = user || loadUserProfile();
 setUserProfile(profile);
 return profile;
 }, [user]);

 /**
 * Load job recommendations
 */
 const loadRecommendations = useCallback(async () => {
 try {
 setLoading(true);
 setError(null);

 // Load user profile first
 const profile = loadUserProfileData();

 const response = await recommendationApi.getRecommendations({
 limit,
 min_score: minScore,
 user_profile: profile
 });

 setRecommendations(response.recommendations || []);
 setUserPreferences(response.user_preferences || null);
 } catch (err) {
 setError(err.message);
 console.error('Failed to load recommendations:', err);
 } finally {
 setLoading(false);
 }
 }, [limit, minScore, loadUserProfileData]);

 /**
 * Load user skills analysis
 */
 const loadSkillsAnalysis = useCallback(async () => {
 try {
 // Load user profile first
 const profile = loadUserProfileData();

 const analysis = await recommendationApi.getUserSkillsAnalysis({
 user_profile: profile
 });
 setSkillsAnalysis(analysis);
 } catch (err) {
 console.error('Failed to load skills analysis:', err);
 }
 }, [loadUserProfileData]);

 /**
 * Update recommendation status
 */
 const updateRecommendationStatus = useCallback(async (recommendationId, status) => {
 try {
 await recommendationApi.updateRecommendationStatus(recommendationId, status);

 // Update local state
 setRecommendations(prev =>
 prev.map(rec =>
 rec.id === recommendationId
 ? { ...rec, status }
 : rec
 )
 );
 } catch (err) {
 setError(err.message);
 throw err;
 }
 }, []);

 /**
 * Apply to a job
 */
 const applyToJob = useCallback(async (jobId, coverLetter = '') => {
 try {
 const application = await recommendationApi.applyToJob(jobId, coverLetter);

 // Update recommendation status to applied
 setRecommendations(prev =>
 prev.map(rec =>
 rec.job.id === jobId
 ? { ...rec, status: 'applied' }
 : rec
 )
 );

 return application;
 } catch (err) {
 setError(err.message);
 throw err;
 }
 }, []);

 /**
 * Refresh recommendations
 */
 const refresh = useCallback(() => {
 // Reload user profile first
 loadUserProfileData();

 loadRecommendations();
 loadSkillsAnalysis();
 }, [loadRecommendations, loadSkillsAnalysis, loadUserProfileData]);

 // Auto-load on mount and when user changes
 useEffect(() => {
 if (autoLoad) {
 loadRecommendations();
 loadSkillsAnalysis();
 }
 }, [autoLoad, loadRecommendations, loadSkillsAnalysis, user]); // Add user dependency

 // Reload recommendations when user profile changes (skills, experience, etc.)
 useEffect(() => {
 if (user && autoLoad) {
 // Small delay to ensure profile data is updated
 const timeoutId = setTimeout(() => {
 loadRecommendations();
 loadSkillsAnalysis();
 }, 500);

 return () => clearTimeout(timeoutId);
 }
 }, [user?.skillsWithProficiency, user?.experience, user?.education, user?.name, loadRecommendations, loadSkillsAnalysis, autoLoad]);

 // Set up refresh interval
 useEffect(() => {
 if (refreshInterval && refreshInterval > 0) {
 const interval = setInterval(refresh, refreshInterval);
 return () => clearInterval(interval);
 }
 }, [refreshInterval, refresh]);

 return {
 recommendations,
 loading,
 error,
 userPreferences,
 skillsAnalysis,
 userProfile,
 updateRecommendationStatus,
 applyToJob,
 refresh,
 loadRecommendations,
 loadSkillsAnalysis
 };
};

/**
 * Custom hook for job search
 */
export const useJobSearch = () => {
 const [jobs, setJobs] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [filters, setFilters] = useState({});

 const searchJobs = useCallback(async (searchParams = {}) => {
 try {
 setLoading(true);
 setError(null);

 const response = await recommendationApi.searchJobs(searchParams);
 setJobs(response.jobs || []);
 setFilters(response.filters || {});
 } catch (err) {
 setError(err.message);
 console.error('Failed to search jobs:', err);
 } finally {
 setLoading(false);
 }
 }, []);

 const clearSearch = useCallback(() => {
 setJobs([]);
 setFilters({});
 setError(null);
 }, []);

 return {
 jobs,
 loading,
 error,
 filters,
 searchJobs,
 clearSearch
 };
};

/**
 * Custom hook for user preferences
 */
export const useUserPreferences = () => {
 const [preferences, setPreferences] = useState(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 const loadPreferences = useCallback(async () => {
 try {
 setLoading(true);
 setError(null);

 const prefs = await recommendationApi.getUserPreferences();
 setPreferences(prefs);
 } catch (err) {
 // If 401 error, use default preferences instead of showing error
 if (err.message.includes('401') || err.message.includes('Unauthorized')) {
 console.warn('User not authenticated, using default preferences');
 setPreferences({
 min_score_threshold: 50,
 preferred_job_types: [],
 preferred_seniority: '',
 preferred_cities: [],
 preferred_countries: [],
 target_salary_min: 0,
 target_salary_max: 200000,
 accepts_remote: true
 });
 } else {
 setError(err.message);
 console.error('Failed to load preferences:', err);
 }
 } finally {
 setLoading(false);
 }
 }, []);

 const updatePreferences = useCallback(async (newPreferences) => {
 try {
 setLoading(true);
 setError(null);

 const updated = await recommendationApi.updateUserPreferences(newPreferences);
 setPreferences(updated);
 } catch (err) {
 setError(err.message);
 throw err;
 } finally {
 setLoading(false);
 }
 }, []);

 // Load preferences on mount
 useEffect(() => {
 loadPreferences();
 }, [loadPreferences]);

 return {
 preferences,
 loading,
 error,
 loadPreferences,
 updatePreferences
 };
};

/**
 * Custom hook for job applications
 */
export const useJobApplications = () => {
 const [applications, setApplications] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 const loadApplications = useCallback(async () => {
 try {
 setLoading(true);
 setError(null);

 const apps = await recommendationApi.getMyApplications();
 setApplications(apps);
 } catch (err) {
 setError(err.message);
 console.error('Failed to load applications:', err);
 } finally {
 setLoading(false);
 }
 }, []);

 // Load applications on mount
 useEffect(() => {
 loadApplications();
 }, [loadApplications]);

 return {
 applications,
 loading,
 error,
 loadApplications
 };
};

