import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../../contexts/DarkModeContext.jsx';
import { useAuth } from '../../../contexts/AuthContext';
import { saveUserProfile, loadUserProfile, defaultUserProfile, updateUserSkillsWithProficiency } from '../../../utils/profileUtils';
import { profileApiService } from '../../../services/profileApi';
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
  XMarkIcon
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { isDarkMode } = useDarkMode();
  const { user: authUser } = useAuth();

  // States for editable fields
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Load user data from localStorage or use authenticated user data
  const [userData, setUserData] = useState(() => {
    try {
      // If we have authenticated user data, use it as base
      if (authUser) {
        const savedData = loadUserProfile();
        return {
          ...defaultUserProfile,
          ...savedData,
          // Override with authenticated user data
          name: authUser.name || authUser.first_name || 'Utilisateur',
          email: authUser.email || 'user@example.com',
          id: authUser.id
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
    }
  }, [authUser]);

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

  // Add new skill
  const handleAddSkill = () => {
    if (newSkill.trim() && !safeUserData.skills.includes(newSkill.trim())) {
      const updatedSkills = [...safeUserData.skills, newSkill.trim()];

      // Create default skill assessment entry if it doesn't exist
      const updatedSkillAssessments = { ...safeUserData.skillAssessments };
      if (!updatedSkillAssessments[newSkill.trim()]) {
        updatedSkillAssessments[newSkill.trim()] = {
          score: 0,
          level: "Not Assessed",
          verified: false
        };
      }

      setUserData({
        ...safeUserData,
        skills: updatedSkills,
        skillAssessments: updatedSkillAssessments
      });

      setNewSkill('');
      setIsDataModified(true);
    }
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
      const success = await updateUserSkillsWithProficiency(safeUserData.id || 1, newSkills);
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

  // Handle photo removal
  const handlePhotoRemove = async () => {
    try {
      // Update UI immediately
      setUserData({
        ...safeUserData,
        avatar: null
      });
      setIsDataModified(true);

      // Remove from database
      await profileApiService.removeProfilePhoto(safeUserData.id || 1);
      console.log('Photo removed successfully');
    } catch (error) {
      console.error('Error removing photo:', error);
      alert('Failed to remove photo. Please try again.');
    }
  };

  // Handle resume upload
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({
        ...safeUserData,
        resume: file.name
      });
      setIsDataModified(true);
    }
  };

  // Handle adding education entry
  const handleAddEducation = () => {
    const newEducation = {
      school: "",
      program: "New Education Program",
      dateRange: "",
      description: ""
    };

    setUserData({
      ...safeUserData,
      education: [...safeUserData.education, newEducation]
    });

    setIsDataModified(true);
  };

  // Handle editing education entry
  const handleEditEducation = (index, field, value) => {
    const updatedEducation = [...safeUserData.education];
    updatedEducation[index][field] = value;

    setUserData({
      ...safeUserData,
      education: updatedEducation
    });

    setIsDataModified(true);
  };

  // Handle removing education entry
  const handleRemoveEducation = (index) => {
    const updatedEducation = safeUserData.education.filter((_, i) => i !== index);

    setUserData({
      ...safeUserData,
      education: updatedEducation
    });

    setIsDataModified(true);
  };

  // Handle adding experience entry
  const handleAddExperience = () => {
    const newExperience = {
      title: "New Position",
      company: "",
      dateRange: "",
      description: ""
    };

    setUserData({
      ...safeUserData,
      experience: [...safeUserData.experience, newExperience]
    });

    setIsDataModified(true);
  };

  // Handle editing experience entry
  const handleEditExperience = (index, field, value) => {
    const updatedExperience = [...safeUserData.experience];
    updatedExperience[index][field] = value;

    setUserData({
      ...safeUserData,
      experience: updatedExperience
    });

    setIsDataModified(true);
  };

  // Handle removing experience entry
  const handleRemoveExperience = (index) => {
    const updatedExperience = safeUserData.experience.filter((_, i) => i !== index);

    setUserData({
      ...safeUserData,
      experience: updatedExperience
    });

    setIsDataModified(true);
  };

  // Random color generator for skill badges
  const getRandomColor = (text) => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    ];

    // Use the string to deterministically pick a color
    const index = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Modern Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {safeUserData.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  My Profile
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Manage your professional information
                </p>
              </div>
            </div>
            <button
              onClick={saveChanges}
              className={`group flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${isDataModified
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              disabled={!isDataModified}
            >
              <PencilIcon className="w-4 h-4" />
              <span>{isDataModified ? 'Save Changes' : 'No Changes'}</span>
              {isDataModified && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Personal Information Card */}
            <div className="relative bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10"></div>

              <div className="relative z-10">
                {/* Profile Section */}
                <div className="text-center mb-8">
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                      <span className="text-white font-bold text-3xl">
                        {safeUserData.name?.split(' ').map(n => n.charAt(0)).join('').toUpperCase() || 'U'}
                      </span>
                    </div>
                    {/* Status indicator */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {safeUserData.name || 'Your Name'}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {safeUserData.jobTitle || 'Professional Title'}
                  </p>

                  {/* Profile Photo Controls */}
                  <div className="flex justify-center space-x-3 mb-8">
                    <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium cursor-pointer">
                      <PlusCircleIcon className="w-4 h-4" />
                      <span>Add Photo</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </label>
                    <button
                      onClick={handlePhotoRemove}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      <TrashIcon className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Contact Information
                    </h4>
                    <button
                      onClick={() => setIsEditingContact(!isEditingContact)}
                      className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                    >
                      {isEditingContact ? <CheckIcon className="w-4 h-4" /> : <PencilIcon className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                          <EnvelopeIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Email</p>
                          {isEditingContact ? (
                            <input
                              type="email"
                              value={safeUserData.contact.email}
                              onChange={(e) => handleContactUpdate('email', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <a href={`mailto:${safeUserData.contact.email}`} className="text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                              {safeUserData.contact.email}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <PhoneIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Phone</p>
                          {isEditingContact ? (
                            <input
                              type="tel"
                              value={safeUserData.contact.phone}
                              onChange={(e) => handleContactUpdate('phone', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <a href={`tel:${safeUserData.contact.phone}`} className="text-slate-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
                              {safeUserData.contact.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <LinkIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">LinkedIn</p>
                          {isEditingContact ? (
                            <input
                              type="text"
                              value={safeUserData.contact.linkedin}
                              onChange={(e) => handleContactUpdate('linkedin', e.target.value)}
                              placeholder="linkedin.com/in/yourprofile"
                              className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <a href={`https://${safeUserData.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium">
                              {safeUserData.contact.linkedin}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg profile-card">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white section-title">Resume</h2>

              {safeUserData.resume ? (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 glass-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center max-w-[70%]">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3 flex-shrink-0">
                        <PaperClipIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 overflow-hidden">
                        <p className="font-medium text-gray-800 dark:text-white truncate" title={safeUserData.resume}>{safeUserData.resume}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF Document • Uploaded on Sep 1, 2025</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex space-x-2">
                      <button className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg">
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      </button>
                      <button className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No resume uploaded yet</p>
                  <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 inline-flex items-center cursor-pointer">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    <span>Upload Resume</span>
                    <input type="file" className="hidden" onChange={handleResumeUpload} accept=".pdf,.doc,.docx" />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg profile-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white section-title">Personal Information</h2>
                <button
                  onClick={() => setIsEditingInfo(!isEditingInfo)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  {isEditingInfo ? <CheckIcon className="w-5 h-5" /> : <PencilIcon className="w-5 h-5" />}
                </button>
              </div>

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  {isEditingInfo ? (
                    <input
                      type="text"
                      value={safeUserData.name}
                      onChange={(e) => handleInfoUpdate('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 profile-input"
                    />
                  ) : (
                    <p className="bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg text-gray-800 dark:text-white">
                      {safeUserData.name}
                    </p>
                  )}
                </div>

                <div className="section-divider"></div>
                {/* Languages Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Languages</label>
                  <div className="flex flex-wrap gap-2">
                    {safeUserData.languages.map((language, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm font-medium"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="section-divider"></div>
                {/* About Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About</label>
                  {isEditingInfo ? (
                    <textarea
                      value={safeUserData.about}
                      onChange={(e) => handleInfoUpdate('about', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 profile-input"
                    ></textarea>
                  ) : (
                    <p className="bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg text-gray-800 dark:text-white">
                      {safeUserData.about}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg profile-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white section-title">Compétences</h2>
              </div>

              {/* New Skills Selector Component */}
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

            {/* Education Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg profile-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white section-title">Education</h2>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  <PlusCircleIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {safeUserData.education.map((edu, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 education-card hover-lift"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <h3 className="font-medium text-gray-800 dark:text-white mb-1 sm:mb-0">{edu.program}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-0">{edu.dateRange}</span>
                    </div>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">{edu.school}</p>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">{edu.description}</p>
                    <div className="flex justify-end mt-3 space-x-2">
                      <button className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg profile-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white section-title">Work Experience</h2>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  <PlusCircleIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {safeUserData.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 experience-card hover-lift"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <h3 className="font-medium text-gray-800 dark:text-white mb-1 sm:mb-0">{exp.title}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-0">{exp.dateRange}</span>
                    </div>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">{exp.company}</p>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">{exp.description}</p>
                    <div className="flex justify-end mt-3 space-x-2">
                      <button className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;