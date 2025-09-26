import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../../contexts/DarkModeContext.jsx';
import { useAuth } from '../../../contexts/AuthContext';
import { saveUserProfile, loadUserProfile, defaultUserProfile, updateUserSkillsWithProficiency } from '../../../utils/profileUtils';
import { profileApiService } from '../../../services/profileApi';
import { getTestResults, getUserTestStats } from '../../../utils/testScoring';
import SkillsSelector from './SkillsSelector';
import '../styles/profile.css';
import {
  PencilIcon,
  TrashIcon,
  PaperClipIcon,
  ArrowDownTrayIcon,
  LinkIcon,
  EnvelopeIcon,
  PhoneIcon,
  PlusCircleIcon,
  CheckIcon,
  XMarkIcon,
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { isDarkMode } = useDarkMode();
  const { user: authUser, logout } = useAuth();

  // States for editable fields
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Modal states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddEducationOpen, setIsAddEducationOpen] = useState(false);
  const [isAddExperienceOpen, setIsAddExperienceOpen] = useState(false);

  // Form states for adding new items
  const [newEducation, setNewEducation] = useState({
    program: '',
    school: '',
    dateRange: '',
    description: ''
  });
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    dateRange: '',
    description: ''
  });

  // Load user data from localStorage or use authenticated user data
  const [userData, setUserData] = useState(() => {
    try {
      // If we have authenticated user data, use it as base
      if (authUser) {
        const savedData = loadUserProfile(authUser.id);
        return {
          ...defaultUserProfile,
          ...savedData,
          // Override with authenticated user data
          name: authUser.name || authUser.first_name || 'Utilisateur',
          email: authUser.email || 'user@example.com',
          id: authUser.id,
          contact: {
            ...defaultUserProfile.contact,
            ...(savedData?.contact || {}),
            email: authUser.email || 'user@example.com'
          }
        };
      }

      const savedData = loadUserProfile();
      return savedData || defaultUserProfile;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return defaultUserProfile;
    }
  });

  // State for tracking if data has been modified
  const [isDataModified, setIsDataModified] = useState(false);

  // Update userData when authUser changes
  useEffect(() => {
    if (authUser) {
      setUserData(prevData => ({
        ...prevData,
        name: authUser.name || authUser.first_name || 'Utilisateur',
        email: authUser.email || 'user@example.com',
        id: authUser.id
      }));

      // Load user skills from database
      loadUserSkillsFromDatabase(authUser.id);
    }
  }, [authUser]);

  // Check test scores when component loads
  useEffect(() => {
    console.log('🔍 ProfilePage loaded - checking test scores...');
    const userId = userData.id || authUser?.id || 1;
    console.log('🔍 User ID:', userId);

    // Get test results
    const testResults = getTestResults(userId);
    console.log('📊 Test Results:', testResults);

    // Get test statistics
    const testStats = getUserTestStats(userId);
    console.log('📈 Test Statistics:', testStats);

    // Log individual test details
    if (testResults.length > 0) {
      console.log('🎯 Test Details:');
      testResults.forEach((result, index) => {
        console.log(`  Test ${index + 1}:`, {
          testId: result.testId,
          score: result.result?.score || 'N/A',
          percentage: result.result?.percentage || 'N/A',
          passed: result.result?.passed || false,
          completedAt: result.completedAt,
          timeSpent: result.timeSpent || 'N/A'
        });
      });
    } else {
      console.log('❌ No test results found');
    }
  }, [userData.id, authUser?.id]);

  // Load user skills from database
  const loadUserSkillsFromDatabase = async (userId) => {
    try {
      console.log('Loading skills from database for user:', userId);

      // Fetch candidate data which includes skills
      const response = await fetch(`http://localhost:8000/api/candidates/${userId}/`);
      if (response.ok) {
        const candidateData = await response.json();
        console.log('Candidate data loaded:', candidateData);

        if (candidateData.skills && candidateData.skills.length > 0) {
          // Convert database skills to the format expected by the UI
          const skillsWithProficiency = candidateData.skills.map(skill => ({
            id: skill.id,
            name: skill.name,
            proficiency: skill.proficiency || 'intermediate' // Default proficiency
          }));

          const skillNames = skillsWithProficiency.map(skill => skill.name);

          setUserData(prevData => ({
            ...prevData,
            skills: skillNames,
            skillsWithProficiency: skillsWithProficiency
          }));

          console.log('Skills loaded from database:', skillsWithProficiency);
        }
      } else {
        console.log('No candidate data found, using localStorage skills');
      }
    } catch (error) {
      console.error('Error loading skills from database:', error);
      // Continue with localStorage data if database fails
    }
  };

  // Load skills on component mount if user is already authenticated
  useEffect(() => {
    if (authUser?.id && !userData.skillsWithProficiency?.length) {
      loadUserSkillsFromDatabase(authUser.id);
    }
  }, []);

  // Ensure userData has the required structure
  const safeUserData = {
    ...defaultUserProfile,
    ...userData,
    contact: {
      ...defaultUserProfile.contact,
      ...(userData?.contact || {})
    },
    // Ensure arrays are always defined
    languages: userData?.languages || defaultUserProfile.languages || [],
    skills: userData?.skills || defaultUserProfile.skills || [],
    skillsWithProficiency: userData?.skillsWithProficiency || defaultUserProfile.skillsWithProficiency || [],
    education: userData?.education || defaultUserProfile.education || [],
    experience: userData?.experience || defaultUserProfile.experience || []
  };

  // Save changes to both localStorage and database
  const saveChanges = async () => {
    try {
      // Save to localStorage first (immediate)
      const localSuccess = saveUserProfile(userData);

      if (localSuccess) {
        // Save to database (async)
        try {
          await profileApiService.updateUserProfile(userData.id || 1, {
            first_name: userData.name?.split(' ')[0] || '',
            last_name: userData.name?.split(' ').slice(1).join(' ') || '',
            email: userData.contact?.email || '',
            phone: userData.contact?.phone || '',
            linkedin: userData.contact?.linkedin || '',
            bio: userData.bio || '',
            location: userData.location || ''
          });

          console.log('Profile saved to database successfully');
          setIsDataModified(false);
          alert("Profile changes saved successfully to database!");
        } catch (dbError) {
          console.warn('Database save failed, but localStorage save succeeded:', dbError);
          setIsDataModified(false);
          alert("Profile changes saved locally! Database sync will be attempted later.");
        }
      } else {
        alert("Failed to save profile changes. Please try again.");
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert("Failed to save profile changes. Please try again.");
    }
  };

  // Handle info update
  const handleInfoUpdate = (field, value) => {
    setUserData({
      ...safeUserData,
      [field]: value
    });
    setIsDataModified(true);
  };

  // Handle contact update
  const handleContactUpdate = (field, value) => {
    setUserData({
      ...safeUserData,
      contact: {
        ...safeUserData.contact,
        [field]: value
      }
    });
    setIsDataModified(true);
  };

  // Handle skills change from SkillsSelector with auto-save
  const handleSkillsChange = async (newSkills) => {
    // Convert skills with proficiency back to simple array for compatibility
    const skillNames = newSkills.map(skill => skill.name);
    const updatedUserData = {
      ...safeUserData,
      skills: skillNames,
      skillsWithProficiency: newSkills // Store detailed skills separately
    };

    setUserData(updatedUserData);

    // Auto-save skills changes immediately to both localStorage and database
    try {
      // Use the authenticated user ID or fallback to 1
      const userId = authUser?.id || safeUserData.id || 1;
      console.log('🔍 ProfilePage - authUser:', authUser);
      console.log('🔍 ProfilePage - safeUserData.id:', safeUserData.id);
      console.log('🔍 ProfilePage - Using userId:', userId);
      console.log('🔍 ProfilePage - New skills to save:', newSkills);

      const success = await updateUserSkillsWithProficiency(userId, newSkills);
      if (success) {
        console.log('Skills updated and saved successfully to both localStorage and database');
        setIsDataModified(false);
      } else {
        console.error('Failed to save skills changes');
        setIsDataModified(true);
      }
    } catch (error) {
      console.error('Error saving skills:', error);
      setIsDataModified(true);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Create preview URL for immediate UI update
        const reader = new FileReader();
        reader.onload = (e) => {
          setUserData({
            ...safeUserData,
            avatar: e.target.result
          });
          setIsDataModified(true);
        };
        reader.readAsDataURL(file);

        // Upload to database
        await profileApiService.uploadProfilePhoto(safeUserData.id || 1, file);
        console.log('Photo uploaded successfully');
      } catch (error) {
        console.error('Error uploading photo:', error);
        alert('Failed to upload photo. Please try again.');
      }
    }
  };

  // Handle photo remove
  const handlePhotoRemove = () => {
    setUserData({
      ...safeUserData,
      avatar: null
    });
    setIsDataModified(true);
  };

  // Handle resume upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Create preview URL for immediate UI update
        const reader = new FileReader();
        reader.onload = (e) => {
          setUserData({
            ...safeUserData,
            resume: file.name
          });
          setIsDataModified(true);
        };
        reader.readAsDataURL(file);

        // Upload to database
        await profileApiService.uploadResume(safeUserData.id || 1, file);
        console.log('Resume uploaded successfully');
      } catch (error) {
        console.error('Error uploading resume:', error);
        alert('Failed to upload resume. Please try again.');
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  // ===== MODAL HANDLERS =====

  // Settings modal handlers
  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  // Education handlers
  const handleAddEducation = () => {
    setIsAddEducationOpen(true);
    setIsEditingEducation(false);
  };

  const closeAddEducation = () => {
    setIsAddEducationOpen(false);
    setNewEducation({ program: '', school: '', dateRange: '', description: '' });
  };

  const handleEducationSubmit = (e) => {
    e.preventDefault();
    if (newEducation.program && newEducation.school) {
      const updatedEducation = [...safeUserData.education, newEducation];
      setUserData({
        ...safeUserData,
        education: updatedEducation
      });
      setIsDataModified(true);
      closeAddEducation();
    }
  };

  // Experience handlers
  const handleAddExperience = () => {
    setIsAddExperienceOpen(true);
    setIsEditingExperience(false);
  };

  const closeAddExperience = () => {
    setIsAddExperienceOpen(false);
    setNewExperience({ title: '', company: '', dateRange: '', description: '' });
  };

  const handleExperienceSubmit = (e) => {
    e.preventDefault();
    if (newExperience.title && newExperience.company) {
      const updatedExperience = [...safeUserData.experience, newExperience];
      setUserData({
        ...safeUserData,
        experience: updatedExperience
      });
      setIsDataModified(true);
      closeAddExperience();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header / Profile Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-800">
                <span className="text-3xl font-semibold text-gray-600 dark:text-gray-300">
                  {safeUserData.name?.split(' ').map(n => n.charAt(0)).join('').toUpperCase() || 'U'}
                </span>
              </div>
              <label className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                <PencilIcon className="w-4 h-4" />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </label>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-white">
              <h1 className="text-3xl font-bold mb-2">{safeUserData.name || 'Your Name'}</h1>
              <p className="text-xl text-blue-100 dark:text-gray-300 mb-2">{safeUserData.jobTitle || 'Professional Title'}</p>
              <div className="flex items-center space-x-4 text-blue-100 dark:text-gray-300">
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{safeUserData.location || 'Location'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>{safeUserData.contact?.email || 'email@example.com'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {/* Save Changes Button - Only show when there are unsaved changes */}
              {isDataModified && (
                <button
                  onClick={saveChanges}
                  className="px-6 py-2 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
              )}
              <button
                onClick={openSettings}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* About Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About</h3>
                  <button
                    onClick={() => setIsEditingInfo(!isEditingInfo)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {isEditingInfo ? <CheckIcon className="w-4 h-4" /> : <PencilIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="px-6 py-4">
                {isEditingInfo ? (
                  <textarea
                    value={safeUserData.about}
                    onChange={(e) => handleInfoUpdate('about', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {safeUserData.about || 'No bio available. Click edit to add information about yourself.'}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact</h3>
                  <button
                    onClick={() => setIsEditingContact(!isEditingContact)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {isEditingContact ? <CheckIcon className="w-4 h-4" /> : <PencilIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    {isEditingContact ? (
                      <input
                        type="email"
                        value={safeUserData.contact.email}
                        onChange={(e) => handleContactUpdate('email', e.target.value)}
                        className="w-full text-sm bg-transparent border-none p-0 text-gray-900 dark:text-white focus:outline-none"
                      />
                    ) : (
                      <a href={`mailto:${safeUserData.contact.email}`} className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 truncate block">
                        {safeUserData.contact.email}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-4 h-4 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    {isEditingContact ? (
                      <input
                        type="tel"
                        value={safeUserData.contact.phone}
                        onChange={(e) => handleContactUpdate('phone', e.target.value)}
                        className="w-full text-sm bg-transparent border-none p-0 text-gray-900 dark:text-white focus:outline-none"
                      />
                    ) : (
                      <a href={`tel:${safeUserData.contact.phone}`} className="text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 truncate block">
                        {safeUserData.contact.phone}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    {isEditingContact ? (
                      <input
                        type="text"
                        value={safeUserData.contact.linkedin}
                        onChange={(e) => handleContactUpdate('linkedin', e.target.value)}
                        placeholder="linkedin.com/in/yourprofile"
                        className="w-full text-sm bg-transparent border-none p-0 text-gray-900 dark:text-white focus:outline-none"
                      />
                    ) : (
                      <a href={`https://${safeUserData.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 truncate block">
                        {safeUserData.contact.linkedin}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resume</h3>
              </div>
              <div className="px-6 py-4">
                {safeUserData.resume ? (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <div className="flex items-center space-x-3">
                      <PaperClipIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{safeUserData.resume}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF • Sep 1, 2025</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <PaperClipIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No resume uploaded</p>
                    <label className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
                      <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                      Upload Resume
                      <input type="file" className="hidden" onChange={handleResumeUpload} accept=".pdf,.doc,.docx" />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills & Technologies</h2>
                  <button
                    onClick={() => setIsEditingSkills(!isEditingSkills)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {isEditingSkills ? <CheckIcon className="w-5 h-5" /> : <PencilIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="px-6 py-4 relative">
                <SkillsSelector
                  skills={safeUserData.skillsWithProficiency || safeUserData.skills.map(skill => ({
                    id: typeof skill === 'string' ? skill : skill.id || skill.name,
                    name: typeof skill === 'string' ? skill : skill.name,
                    proficiency: typeof skill === 'string' ? 'intermediate' : skill.proficiency || 'intermediate'
                  }))}
                  onSkillsChange={handleSkillsChange}
                  showRecommendations={true}
                />
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <AcademicCapIcon className="w-5 h-5 mr-2" />
                    Education
                  </h2>
                  <button
                    onClick={() => setIsEditingEducation(!isEditingEducation)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {isEditingEducation ? <CheckIcon className="w-5 h-5" /> : <PlusCircleIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="px-6 py-4">
                {safeUserData.education.length > 0 ? (
                  <div className="space-y-4">
                    {safeUserData.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">{edu.program}</h3>
                            <p className="text-sm text-blue-600 dark:text-blue-400">{edu.school}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{edu.description}</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{edu.dateRange}</span>
                            {isEditingEducation && (
                              <>
                                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AcademicCapIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No education added yet</p>
                    <button
                      onClick={handleAddEducation}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <PlusCircleIcon className="w-4 h-4 mr-2" />
                      Add Education
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <BriefcaseIcon className="w-5 h-5 mr-2" />
                    Work Experience
                  </h2>
                  <button
                    onClick={() => setIsEditingExperience(!isEditingExperience)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {isEditingExperience ? <CheckIcon className="w-5 h-5" /> : <PlusCircleIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="px-6 py-4">
                {safeUserData.experience.length > 0 ? (
                  <div className="space-y-4">
                    {safeUserData.experience.map((exp, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">{exp.title}</h3>
                            <p className="text-sm text-green-600 dark:text-green-400">{exp.company}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{exp.description}</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{exp.dateRange}</span>
                            {isEditingExperience && (
                              <>
                                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BriefcaseIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No work experience added yet</p>
                    <button
                      onClick={handleAddExperience}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <PlusCircleIcon className="w-4 h-4 mr-2" />
                      Add Experience
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODALS ===== */}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Settings</h3>
                <button
                  onClick={closeSettings}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  Change Password
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  Privacy Settings
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  Notification Preferences
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  Data Export
                </button>
                {/* Disconnect button - calls the same logout function as the header button */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={closeSettings}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Education Modal */}
      {isAddEducationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <AcademicCapIcon className="w-5 h-5 mr-2" />
                  Add Education
                </h3>
                <button
                  onClick={closeAddEducation}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <form onSubmit={handleEducationSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Program/Degree *
                </label>
                <input
                  type="text"
                  value={newEducation.program}
                  onChange={(e) => setNewEducation({ ...newEducation, program: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Bachelor of Computer Science"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  School/University *
                </label>
                <input
                  type="text"
                  value={newEducation.school}
                  onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., University of Technology"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Range
                </label>
                <input
                  type="text"
                  value={newEducation.dateRange}
                  onChange={(e) => setNewEducation({ ...newEducation, dateRange: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 2020 - 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newEducation.description}
                  onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Additional details about your education..."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeAddEducation}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Experience Modal */}
      {isAddExperienceOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <BriefcaseIcon className="w-5 h-5 mr-2" />
                  Add Work Experience
                </h3>
                <button
                  onClick={closeAddExperience}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <form onSubmit={handleExperienceSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={newExperience.title}
                  onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Software Developer"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Tech Corp Inc."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Range
                </label>
                <input
                  type="text"
                  value={newExperience.dateRange}
                  onChange={(e) => setNewExperience({ ...newExperience, dateRange: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Jan 2022 - Present"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newExperience.description}
                  onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Describe your role and achievements..."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeAddExperience}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;