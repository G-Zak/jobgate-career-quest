import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import JobRecommendations from './JobRecommendations';
import {
 AdjustmentsHorizontalIcon,
 FunnelIcon,
 MagnifyingGlassIcon,
 SparklesIcon,
 ExclamationTriangleIcon,
 UserCircleIcon,
 BriefcaseIcon,
 ArrowPathIcon,
 PencilIcon,
 ArrowRightOnRectangleIcon,
 MapPinIcon,
 ClockIcon
} from '@heroicons/react/24/outline';
import { loadUserProfile } from '../../../utils/profileUtils';

const JobRecommendationsPage = () => {
 const navigate = useNavigate();
 const { user, isAuthenticated, logout } = useAuth();
 const [userProfile, setUserProfile] = useState(null);

 // Debug userProfile changes
 useEffect(() => {
 console.log(' JobRecommendationsPage - userProfile state changed:', userProfile);
 if (userProfile) {
 console.log(' JobRecommendationsPage - Skills in userProfile:', userProfile.skills);
 console.log(' JobRecommendationsPage - skillsWithProficiency in userProfile:', userProfile.skillsWithProficiency);
 }
 }, [userProfile]);
 const [profileUpdateTime, setProfileUpdateTime] = useState(Date.now());
 const [refreshing, setRefreshing] = useState(false);

 const [filters, setFilters] = useState({
 location: "",
 jobType: "",
 remote: false,
 salaryMin: "",
 experience: ""
 });

 const [showFilters, setShowFilters] = useState(false);
 const [isEditingProfile, setIsEditingProfile] = useState(false);
 const [profileForm, setProfileForm] = useState({
 location: "",
 experienceLevel: ""
 });

 // Load user profile from database
 useEffect(() => {
 const loadProfileFromDatabase = async () => {
 try {
 console.log(' JobRecommendationsPage - Loading profile from database...');

 // Check authentication status first
 const token = localStorage.getItem('access_token');
 const user = JSON.parse(localStorage.getItem('user') || 'null');
 console.log(' JobRecommendationsPage - Auth check:');
 console.log(' - isAuthenticated (from context):', isAuthenticated);
 console.log(' - user (from context):', user);
 console.log(' - Token present:', !!token);
 console.log(' - User present (localStorage):', !!user);
 console.log(' - User data (localStorage):', user);

 if (!token || !user) {
 console.warn(' User not authenticated, redirecting to login...');
 // You might want to redirect to login page here
 return;
 }

 // Import the API service
 const { default: jobRecommendationsApi } = await import('../../../services/jobRecommendationsApi');

 // Try to get user profile from the working candidate API first
 try {
 console.log(' JobRecommendationsPage - Trying candidate API...');
 const candidateResponse = await fetch(`http://localhost:8000/api/candidates/1/`, {
 method: 'GET',
 headers: {
 'Content-Type': 'application/json',
 'Authorization': `Bearer ${token}`,
 },
 credentials: 'include',
 });

 if (candidateResponse.ok) {
 const candidateData = await candidateResponse.json();
 console.log(' JobRecommendationsPage - Candidate API response:', candidateData);

 // Transform candidate data to match expected format
 const transformedProfile = {
 id: candidateData.id,
 name: candidateData.first_name + ' ' + candidateData.last_name,
 email: candidateData.email,
 location: candidateData.location || '',
 about: candidateData.bio || '',
 skills: candidateData.skills_with_proficiency?.map(skill => skill.name) || candidateData.skills?.map(skill => skill.name) || [],
 skillsWithProficiency: candidateData.skills_with_proficiency || candidateData.skills?.map(skill => ({
 id: skill.id,
 name: skill.name,
 proficiency: 'intermediate'
 })) || [],
 education: [],
 experience: []
 };

 console.log(' JobRecommendationsPage - Transformed profile from candidate API:', transformedProfile);
 console.log(' JobRecommendationsPage - Skills from skills_with_proficiency:', candidateData.skills_with_proficiency);
 console.log(' JobRecommendationsPage - Skills from skills (ManyToMany):', candidateData.skills);
 console.log(' JobRecommendationsPage - Final skills array:', transformedProfile.skills);
 console.log(' JobRecommendationsPage - Final skillsWithProficiency array:', transformedProfile.skillsWithProficiency);
 setUserProfile(transformedProfile);
 console.log(' JobRecommendationsPage - userProfile state set, skills should be visible now');
 return; // Success, exit early
 } else {
 console.warn('Candidate API failed, trying recommendation API...');
 }
 } catch (candidateError) {
 console.warn('Candidate API error:', candidateError);
 }

 // Fallback to recommendation API
 const response = await jobRecommendationsApi.getUserProfile();
 if (response.success && response.profile) {
 const profileData = response.profile;
 console.log(' JobRecommendationsPage - Database profile:', profileData);
 console.log(' JobRecommendationsPage - Database skills:', profileData.skills);

 // Transform database profile to match expected format
 const transformedProfile = {
 id: profileData.user_id,
 name: profileData.name,
 email: profileData.email,
 location: profileData.location,
 about: profileData.about,
 skills: profileData.skills_with_proficiency?.map(skill => skill.name) || profileData.skills?.map(skill => skill.name) || [],
 skillsWithProficiency: profileData.skills_with_proficiency || profileData.skills?.map(skill => ({
 id: skill.id,
 name: skill.name,
 proficiency: 'intermediate'
 })) || [],
 education: [],
 experience: []
 };

 console.log(' JobRecommendationsPage - Transformed profile:', transformedProfile);
 setUserProfile(transformedProfile);
 } else {
 console.warn('Failed to load profile from database, using localStorage fallback');
 const profile = loadUserProfile();
 console.log(' JobRecommendationsPage - Using localStorage fallback profile:', profile);
 setUserProfile(profile);
 }
 } catch (error) {
 console.error('Error loading profile from database:', error);
 // Fallback to localStorage
 const profile = loadUserProfile();
 console.log(' JobRecommendationsPage - Using localStorage fallback profile:', profile);
 setUserProfile(profile);
 }
 };

 loadProfileFromDatabase();
 }, []);

 // Disabled real-time updates to prevent conflicts with database profile
 // useEffect(() => {
 // const handleProfileUpdate = async () => {
 // console.log('Profile updated, refreshing from database...');
 // // Reload from database instead of localStorage
 // try {
 // const { default: jobRecommendationsApi } = await import('../../../services/jobRecommendationsApi');
 // const response = await jobRecommendationsApi.getUserProfile();
 // if (response.success && response.profile) {
 // const profileData = response.profile;
 // const transformedProfile = {
 // id: profileData.user_id,
 // name: profileData.name,
 // email: profileData.email,
 // location: profileData.location,
 // about: profileData.about,
 // skills: profileData.skills?.map(skill => skill.name) || [],
 // skillsWithProficiency: profileData.skills?.map(skill => ({
 // id: skill.id,
 // name: skill.name,
 // proficiency: 'intermediate'
 // })) || [],
 // education: [],
 // experience: []
 // };
 // setUserProfile(transformedProfile);
 // setProfileUpdateTime(Date.now());
 // }
 // } catch (error) {
 // console.error('Error refreshing profile from database:', error);
 // }
 // };

 // const handleCustomProfileUpdate = (event) => {
 // const updatedProfile = event.detail.profile;
 // setUserProfile(updatedProfile);
 // setProfileUpdateTime(Date.now());
 // console.log('Real-time profile update received on recommendations page');
 // };

 // // Listen for storage changes
 // window.addEventListener('storage', handleProfileUpdate);

 // // Listen for custom profile update events (instant updates)
 // window.addEventListener('profileUpdated', handleCustomProfileUpdate);

 // // Check for changes periodically (fallback)
 // const interval = setInterval(() => {
 // const currentProfile = loadUserProfile();
 // if (currentProfile && JSON.stringify(currentProfile) !== JSON.stringify(userProfile)) {
 // setUserProfile(currentProfile);
 // setProfileUpdateTime(Date.now());
 // }
 // }, 2000);

 // return () => {
 // window.removeEventListener('storage', handleProfileUpdate);
 // window.removeEventListener('profileUpdated', handleCustomProfileUpdate);
 // clearInterval(interval);
 // };
 // }, [userProfile]);

 const [userSkills, setUserSkills] = useState([]);

 // Recalculate userSkills when userProfile changes
 useEffect(() => {
 if (userProfile) {
 console.log(' JobRecommendationsPage - userProfile changed, recalculating userSkills');
 console.log(' - userProfile.skills:', userProfile.skills);
 console.log(' - userProfile.skillsWithProficiency:', userProfile.skillsWithProficiency);

 const skills = userProfile?.skillsWithProficiency?.map(skill => skill.name) || userProfile?.skills || [];
 console.log(' JobRecommendationsPage - Calculated userSkills:', skills);
 setUserSkills(skills);
 } else {
 console.log(' JobRecommendationsPage - userProfile is null, setting userSkills to empty array');
 setUserSkills([]);
 }
 }, [userProfile]);

 const hasSkills = userSkills.length > 0;
 console.log(' JobRecommendationsPage - userSkills:', userSkills);
 console.log(' JobRecommendationsPage - hasSkills:', hasSkills);

 // Handle refresh
 const handleRefresh = () => {
 setRefreshing(true);
 setTimeout(() => {
 setRefreshing(false);
 window.location.reload();
 }, 1000);
 };

 const handleEditProfile = () => {
 setIsEditingProfile(true);
 setProfileForm({
 location: userProfile?.location || "",
 experienceLevel: userProfile?.experienceLevel || ""
 });
 };

 const handleSaveProfile = () => {
 // Update the user profile with new values
 setUserProfile(prev => ({
 ...prev,
 location: profileForm.location,
 experienceLevel: profileForm.experienceLevel
 }));
 setIsEditingProfile(false);
 setProfileUpdateTime(Date.now());
 };

 const handleCancelEdit = () => {
 setIsEditingProfile(false);
 setProfileForm({
 location: userProfile?.location || "",
 experienceLevel: userProfile?.experienceLevel || ""
 });
 };

 // Handle logout
 const handleLogout = () => {
 logout();
 navigate('/');
 };

 // Skill badge color function (consistent with ProfilePage)
 const getSkillBadgeColor = (skillName) => {
 const colors = [
 'bg-slate-100 text-slate-700 border-slate-200',
 'bg-blue-50 text-blue-700 border-blue-200',
 'bg-gray-100 text-gray-700 border-gray-200',
 'bg-indigo-50 text-indigo-700 border-indigo-200',
 'bg-slate-50 text-slate-600 border-slate-200',
 'bg-blue-50 text-blue-600 border-blue-200',
 'bg-gray-50 text-gray-600 border-gray-200',
 'bg-indigo-50 text-indigo-600 border-indigo-200',
 'bg-slate-50 text-slate-500 border-slate-200',
 'bg-blue-50 text-blue-500 border-blue-200'
 ];

 const hash = skillName.split('').reduce((a, b) => {
 a = ((a << 5) - a) + b.charCodeAt(0);
 return a & a;
 }, 0);
 return colors[Math.abs(hash) % colors.length];
 };

 return (
 <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
 {/* Modern Header - Consistent with Profile/Dashboard */}
 <div className="border-b border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-10">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex items-center justify-between py-6">
 <div className="flex items-center space-x-4">
 <div className="flex items-center space-x-3">
 <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
 <BriefcaseIcon className="w-6 h-6 text-white" />
 </div>
 <div>
 <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
 Job Recommendations
 </h1>
 <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
 {hasSkills
 ? `Based on ${userSkills.length} skill${userSkills.length > 1 ? 's' : ''}`
 : "Complete your profile for personalized recommendations"
 }
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 {/* Profile Warning - Enhanced styling */}
 {!hasSkills && (
 <div className="mb-8">
 <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/60 dark:border-amber-700/60 rounded-2xl p-6 shadow-lg">
 <div className="flex items-start space-x-4">
 <div className="flex-shrink-0">
 <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
 <ExclamationTriangleIcon className="w-6 h-6 text-white" />
 </div>
 </div>
 <div className="flex-1">
 <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-2">
 Incomplete Profile
 </h3>
 <p className="text-amber-800 dark:text-amber-300 mb-4 leading-relaxed">
 Add your skills to your profile to get personalized and accurate job recommendations tailored to your expertise.
 </p>
 <button
 onClick={() => navigate('/dashboard', { state: { activeSection: 'mon-espace' } })}
 className="group inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
 >
 <UserCircleIcon className="w-4 h-4 mr-2" />
 Complete My Profile
 </button>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* User Profile Summary - Enhanced with pill-shaped skill tags */}
 {userProfile && (
 <div className="mb-8">
 <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-lg">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-xl font-bold text-slate-900 dark:text-white">
 Your Search Profile
 </h2>
 <button
 onClick={handleEditProfile}
 className="group flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors"
 >
 <PencilIcon className="w-4 h-4" />
 <span>{isEditingProfile ? 'Cancel' : 'Edit'}</span>
 </button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div>
 <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
 Skills ({userSkills.length})
 </label>
 <div className="flex flex-wrap gap-2">
 {userSkills.slice(0, 3).map((skill, index) => (
 <span
 key={index}
 className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 hover:shadow-sm ${getSkillBadgeColor(skill)}`}
 >
 {skill}
 </span>
 ))}
 {userSkills.length > 3 && (
 <span className="inline-flex items-center px-3 py-1.5 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">
 +{userSkills.length - 3} more
 </span>
 )}
 {userSkills.length === 0 && (
 <span className="text-sm text-red-500 dark:text-red-400 font-medium">
 No skills added
 </span>
 )}
 </div>
 </div>

 <div>
 <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
 Preferred Location
 </label>
 {isEditingProfile ? (
 <div className="space-y-2">
 <select
 value={profileForm.location}
 onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
 className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
 >
 <option value="">Select a city</option>
 <option value="Casablanca">Casablanca</option>
 <option value="Rabat">Rabat</option>
 <option value="Marrakech">Marrakech</option>
 <option value="Fes">Fes</option>
 <option value="Tangier">Tangier</option>
 <option value="Agadir">Agadir</option>
 <option value="Meknes">Meknes</option>
 <option value="Oujda">Oujda</option>
 <option value="Kenitra">Kenitra</option>
 <option value="Tetouan">Tetouan</option>
 <option value="Safi">Safi</option>
 <option value="Essaouira">Essaouira</option>
 <option value="Nador">Nador</option>
 </select>
 </div>
 ) : (
 <div className="flex items-center space-x-2">
 <MapPinIcon className="w-4 h-4 text-slate-400" />
 <p className="text-slate-600 dark:text-slate-400 font-medium">
 {userProfile.location || "Not specified"}
 </p>
 </div>
 )}
 </div>

 <div>
 <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
 Experience Level
 </label>
 {isEditingProfile ? (
 <div className="space-y-2">
 <select
 value={profileForm.experienceLevel}
 onChange={(e) => setProfileForm(prev => ({ ...prev, experienceLevel: e.target.value }))}
 className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
 >
 <option value="">Select experience level</option>
 <option value="junior">Junior (0-2 years)</option>
 <option value="intermediate">Intermediate (2-5 years)</option>
 <option value="senior">Senior (5+ years)</option>
 <option value="lead">Lead (7+ years)</option>
 <option value="principal">Principal (10+ years)</option>
 </select>
 </div>
 ) : (
 <div className="flex items-center space-x-2">
 <ClockIcon className="w-4 h-4 text-slate-400" />
 <p className="text-slate-600 dark:text-slate-400 font-medium">
 {userProfile.experienceLevel || "Not specified"}
 </p>
 </div>
 )}
 </div>
 </div>

 {/* Save/Cancel buttons when editing */}
 {isEditingProfile && (
 <div className="mt-6 flex justify-end space-x-3">
 <button
 onClick={handleCancelEdit}
 className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={handleSaveProfile}
 className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
 >
 Save Changes
 </button>
 </div>
 )}
 </div>
 </div>
 )}

 {/* Modern Filters Bar - Enhanced styling */}
 <div className="mb-8">
 <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-lg">
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
 Search & Filters
 </h3>
 <button className="group flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
 <AdjustmentsHorizontalIcon className="w-4 h-4" />
 <span className="text-sm font-medium">Adjust Recommendations</span>
 </button>
 </div>

 <div className="flex items-center space-x-4">
 <div className="flex-1 relative">
 <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
 <input
 type="text"
 placeholder="Search for opportunities..."
 className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
 />
 </div>

 <button
 onClick={() => setShowFilters(!showFilters)}
 className={`group flex items-center space-x-2 px-4 py-3 border rounded-xl font-medium transition-all duration-200 ${showFilters
 ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-900/20 dark:text-blue-300'
 : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
 }`}
 >
 <FunnelIcon className="w-4 h-4" />
 <span>Filters</span>
 </button>
 </div>

 {/* Expanded Filters - Enhanced with better spacing and dividers */}
 {showFilters && (
 <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 <div>
 <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
 City
 </label>
 <select
 value={filters.location}
 onChange={(e) => setFilters({ ...filters, location: e.target.value })}
 className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
 >
 <option value="">All cities</option>
 <option value="Casablanca">Casablanca</option>
 <option value="Rabat">Rabat</option>
 <option value="Marrakech">Marrakech</option>
 <option value="Fès">Fès</option>
 </select>
 </div>

 <div>
 <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
 Contract Type
 </label>
 <select
 value={filters.jobType}
 onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
 className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
 >
 <option value="">All types</option>
 <option value="CDI">CDI</option>
 <option value="CDD">CDD</option>
 <option value="Stage">Internship</option>
 <option value="Freelance">Freelance</option>
 </select>
 </div>

 <div>
 <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
 Experience
 </label>
 <select
 value={filters.experience}
 onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
 className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
 >
 <option value="">All experience</option>
 <option value="0-1 an">0-1 year</option>
 <option value="1-3 ans">1-3 years</option>
 <option value="3-5 ans">3-5 years</option>
 <option value="5+ ans">5+ years</option>
 </select>
 </div>

 <div className="flex items-end">
 <label className="flex items-center space-x-3">
 <input
 type="checkbox"
 checked={filters.remote}
 onChange={(e) => setFilters({ ...filters, remote: e.target.checked })}
 className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
 />
 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
 Remote only
 </span>
 </label>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Job Recommendations - Direct component without wrapper */}
 <JobRecommendations
 userId={userProfile?.id}
 userSkills={userSkills}
 userLocation={userProfile?.location}
 maxJobs={12}
 realTimeUpdate={true}
 />
 </div>
 </div>
 );
};

export default JobRecommendationsPage;