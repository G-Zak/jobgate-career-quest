import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../../contexts/DarkModeContext.jsx';
import { saveUserProfile, loadUserProfile, defaultUserProfile } from '../../../utils/profileUtils';
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
  
  // States for editable fields
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  
  // Load user data from localStorage or use default
  const [userData, setUserData] = useState(() => {
    const savedData = loadUserProfile();
    return savedData || defaultUserProfile;
  });
  
  // State for tracking if data has been modified
  const [isDataModified, setIsDataModified] = useState(false);

  // Save changes to localStorage
  const saveChanges = () => {
    const success = saveUserProfile(userData);
    if (success) {
      setIsDataModified(false);
      alert("Profile changes saved successfully!");
    } else {
      alert("Failed to save profile changes. Please try again.");
    }
  };

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserData({
          ...userData,
          avatar: e.target.result
        });
        setIsDataModified(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle avatar delete
  const handleAvatarDelete = () => {
    setUserData({
      ...userData,
      avatar: "https://i.pravatar.cc/300?img=placeholder"
    });
    setIsDataModified(true);
  };

  // Handle info update
  const handleInfoUpdate = (field, value) => {
    setUserData({
      ...userData,
      [field]: value
    });
    setIsDataModified(true);
  };

  // Handle contact update
  const handleContactUpdate = (field, value) => {
    setUserData({
      ...userData,
      contact: {
        ...userData.contact,
        [field]: value
      }
    });
    setIsDataModified(true);
  };

  // Add new skill
  const handleAddSkill = () => {
    if (newSkill.trim() && !userData.skills.includes(newSkill.trim())) {
      const updatedSkills = [...userData.skills, newSkill.trim()];
      
      // Create default skill assessment entry if it doesn't exist
      const updatedSkillAssessments = { ...userData.skillAssessments };
      if (!updatedSkillAssessments[newSkill.trim()]) {
        updatedSkillAssessments[newSkill.trim()] = {
          score: 0,
          level: "Not Assessed",
          verified: false
        };
      }
      
      setUserData({
        ...userData,
        skills: updatedSkills,
        skillAssessments: updatedSkillAssessments
      });
      
      setNewSkill('');
      setIsDataModified(true);
    }
  };

  // Handle skills change from SkillsSelector
  const handleSkillsChange = (newSkills) => {
    // Convert skills with proficiency back to simple array for compatibility
    const skillNames = newSkills.map(skill => skill.name);
    setUserData({
      ...userData,
      skills: skillNames,
      skillsWithProficiency: newSkills // Store detailed skills separately
    });
    setIsDataModified(true);
  };

  // Handle resume upload
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({
        ...userData,
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
      ...userData,
      education: [...userData.education, newEducation]
    });
    
    setIsDataModified(true);
  };
  
  // Handle editing education entry
  const handleEditEducation = (index, field, value) => {
    const updatedEducation = [...userData.education];
    updatedEducation[index][field] = value;
    
    setUserData({
      ...userData,
      education: updatedEducation
    });
    
    setIsDataModified(true);
  };
  
  // Handle removing education entry
  const handleRemoveEducation = (index) => {
    const updatedEducation = userData.education.filter((_, i) => i !== index);
    
    setUserData({
      ...userData,
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
      ...userData,
      experience: [...userData.experience, newExperience]
    });
    
    setIsDataModified(true);
  };
  
  // Handle editing experience entry
  const handleEditExperience = (index, field, value) => {
    const updatedExperience = [...userData.experience];
    updatedExperience[index][field] = value;
    
    setUserData({
      ...userData,
      experience: updatedExperience
    });
    
    setIsDataModified(true);
  };
  
  // Handle removing experience entry
  const handleRemoveExperience = (index) => {
    const updatedExperience = userData.experience.filter((_, i) => i !== index);
    
    setUserData({
      ...userData,
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
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Main Content Area */}
      <main className="w-full overflow-y-auto bg-gray-50 dark:bg-gray-900 profile-scrollbar profile-gradient-bg">
        {/* Page Header */}
        <div className="flex items-center justify-end mb-6">
          <button 
            onClick={saveChanges}
            className={`px-4 py-2 ${isDataModified ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white font-medium rounded-lg transition-all duration-200 flex items-center`}
            disabled={!isDataModified}
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            <span>{isDataModified ? 'Save Changes' : 'No Changes'}</span>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avatar Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg profile-card">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center section-title">
                <span>Profile Photo</span>
              </h2>

              <div className="flex flex-col items-center justify-center">
                <div className="relative group mb-4 profile-avatar-container avatar-border-animated">
                  <img 
                    src={userData.avatar} 
                    alt={userData.name} 
                    className="w-40 h-40 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md group-hover:shadow-lg transition-all duration-300 profile-avatar pulse-avatar"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                      <label className="p-2 rounded-full bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition-all">
                        <PencilIcon className="w-5 h-5" />
                        <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                      </label>
                      <button 
                        onClick={handleAvatarDelete} 
                        className="p-2 rounded-full bg-red-600 text-white cursor-pointer hover:bg-red-700 transition-all"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{userData.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Senior Frontend Developer</p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg profile-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white section-title">Contact Information</h2>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <a href={`mailto:${userData.contact.email}`} className="text-blue-600 dark:text-blue-400 hover:underline animated-underline break-all">
                      {userData.contact.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <PhoneIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <a href={`tel:${userData.contact.phone}`} className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 phone-link">
                      {userData.contact.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <LinkIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500 dark:text-gray-400">LinkedIn</p>
                    <a href={`https://${userData.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline animated-underline break-all">
                      {userData.contact.linkedin}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Resume Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg profile-card">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white section-title">Resume</h2>
              
              {userData.resume ? (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 glass-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center max-w-[70%]">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3 flex-shrink-0">
                        <PaperClipIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 overflow-hidden">
                        <p className="font-medium text-gray-800 dark:text-white truncate" title={userData.resume}>{userData.resume}</p>
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
                      value={userData.name}
                      onChange={(e) => handleInfoUpdate('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 profile-input"
                    />
                  ) : (
                    <p className="bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg text-gray-800 dark:text-white">
                      {userData.name}
                    </p>
                  )}
                </div>
                
                <div className="section-divider"></div>
                {/* Languages Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Languages</label>
                  <div className="flex flex-wrap gap-2">
                    {userData.languages.map((language, index) => (
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
                      value={userData.about}
                      onChange={(e) => handleInfoUpdate('about', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 profile-input"
                    ></textarea>
                  ) : (
                    <p className="bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg text-gray-800 dark:text-white">
                      {userData.about}
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
                userSkills={userData.skillsWithProficiency || userData.skills.map(skill => ({ name: skill, proficiency: 'intermediate' }))}
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
                {userData.education.map((edu, index) => (
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
                {userData.experience.map((exp, index) => (
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
