import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCircleIcon,
  UserIcon,
  Cog6ToothIcon,
  LanguageIcon,
  MoonIcon,
  SunIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import Dashboard from '../../../features/candidate-dashboard/components/DashboardCandidat';
import AvailableTests from '../../../features/skills-assessment/components/AvailableTests';
import TechnicalTests from '../../../features/skills-assessment/components/TechnicalTests';
import TestLayout from '../../../features/skills-assessment/components/TestLayout';
import jobgateLogo from '../../../assets/images/ui/JOBGATE LOGO.png';
import formationEnLigne from '../../../assets/images/ui/formation_en_ligne.avif';
import formationTechnique from '../../../assets/images/ui/formation_technique.avif';
import betterImpressions from '../../../assets/images/ui/better_impressions.avif';

const MainDashboard = () => {
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const profileDropdownRef = useRef(null);

  // Ensure i18n is initialized
  const currentLanguage = i18n?.language || 'en';

  // Language change handler
  const changeLanguage = (lng) => {
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(lng);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Map skill categories to test types
  const skillToTestMap = {
    'numerical': 'numerical-tests',
    'verbal': 'verbal-tests', 
    'logical': 'logical-tests',
    'abstract': 'abstract-tests',
    'diagrammatic': 'diagrammatic-tests',
    'spatial': 'spatial-tests',
    'cognitive assessment': 'cognitive-tests',
    'personality': 'personality-tests',
    'situational': 'situational-tests',
    'technical': 'technical-tests',
    'accelerated learning': 'learning-tests'
  };

  const skillCategories = [
    'Accelerated Learning',
    'Numerical', 
    'Verbal',
    'Logical',
    'Abstract',
    'Diagrammatic',
    'Spatial',
    'Cognitive Assessment',
    'Personality',
    'Situational',
    'Technical'
  ];

  const carouselImages = [
    { title: 'Développement Web Avancé', subtitle: 'Maîtrisez les dernières technologies du web', image: formationEnLigne },
    { title: 'Support Technique et Dépannage', subtitle: 'Devenez un expert en résolution de problèmes IT', image: formationTechnique },
    { title: 'Excellence en Service Client', subtitle: "Les clés d'une communication et d'un service réussis", image: betterImpressions }
  ];

  const handleSkillCategoryClick = (skillName) => {
    const normalizedSkill = skillName.toLowerCase();
    const testType = skillToTestMap[normalizedSkill] || 'available-tests';
    
    setActiveSection(testType);
    // Keep dropdown open - don't close it automatically
  };

  const nextSlide = () => {
    setCurrentCarouselIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Header Bar */}
      <div className={`header-bar h-16 border-b px-12 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="header-content h-full flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Logo */}
          <div className="logo-container flex items-center">
            <img 
              src={jobgateLogo} 
              alt="Jobgate" 
              className="logo-image h-8"
            />
          </div>
          
          {/* Center Navigation */}
          <nav className="main-navigation flex items-center space-x-8">
            <button 
              onClick={() => setActiveSection('dashboard')}
              className={`nav-button text-base font-medium transition-colors pb-1 ${
                activeSection === 'dashboard' 
                  ? 'text-blue-500 border-b-2 border-blue-500' 
                  : `${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-500'}`
              }`}
            >
              {t('dashboard')}
            </button>
            
            <button 
              onClick={() => setActiveSection('jobs')}
              className={`nav-button text-base font-medium transition-colors pb-1 ${
                activeSection === 'jobs' 
                  ? 'text-blue-500 border-b-2 border-blue-500' 
                  : `${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-500'}`
              }`}
            >
              {t('jobs')}
            </button>
            
            <button 
              onClick={() => setActiveSection('career')}
              className={`nav-button text-base font-medium transition-colors pb-1 ${
                activeSection === 'career' 
                  ? 'text-blue-500 border-b-2 border-blue-500' 
                  : `${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-500'}`
              }`}
            >
              {t('career')}
            </button>
          </nav>

          {/* Right Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className={`user-avatar w-8 h-8 rounded-full transition-colors flex items-center justify-center group ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              <UserIcon className={`w-5 h-5 transition-colors ${
                isDarkMode ? 'text-gray-300 group-hover:text-gray-200' : 'text-gray-600 group-hover:text-gray-700'
              }`} />
            </button>

            {/* Professional Dropdown Menu */}
            {showProfileDropdown && (
              <div className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg border py-2 z-50 transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                {/* User Info Section */}
                <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">YA</span>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Yassine</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>yassine@jobgate.com</p>
                    </div>
                  </div>
                </div>

                {/* Main Menu Items */}
                <div className="py-2">
                  <button 
                    onClick={() => {
                      setActiveSection('profile');
                      setShowProfileDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{t('profile')}</span>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveSection('settings');
                      setShowProfileDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Cog6ToothIcon className="w-4 h-4" />
                    <span>{t('settings')}</span>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveSection('notifications');
                      setShowProfileDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <BellIcon className="w-4 h-4" />
                    <span>{t('notifications')}</span>
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">3</span>
                  </button>
                </div>

                {/* Language Selector */}
                <div className={`border-t py-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <div className="px-4 py-1">
                    <p className={`text-xs font-semibold uppercase tracking-wide ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{t('language')}</p>
                  </div>
                  <button 
                    onClick={() => changeLanguage(currentLanguage === 'fr' ? 'en' : 'fr')}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between transition-colors ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <LanguageIcon className="w-4 h-4" />
                      <span>{currentLanguage === 'fr' ? t('french') : t('english')}</span>
                    </div>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {currentLanguage ? currentLanguage.toUpperCase() : 'EN'}
                    </span>
                  </button>
                </div>

                {/* Theme Toggle */}
                <div className={`border-t py-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <div className="px-4 py-1">
                    <p className={`text-xs font-semibold uppercase tracking-wide ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{t('appearance')}</p>
                  </div>
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between transition-colors ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {isDarkMode ? (
                        <SunIcon className="w-4 h-4" />
                      ) : (
                        <MoonIcon className="w-4 h-4" />
                      )}
                      <span>{isDarkMode 
                        ? t('lightMode')
                        : t('darkMode')
                      }</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors ${isDarkMode ? 'bg-blue-500' : 'bg-gray-300'} relative`}>
                      <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${isDarkMode ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                    </div>
                  </button>
                </div>

                {/* Help & Support */}
                <div className={`border-t py-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <button 
                    onClick={() => {
                      setActiveSection('help');
                      setShowProfileDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <QuestionMarkCircleIcon className="w-4 h-4" />
                    <span>{t('help')}</span>
                  </button>
                </div>

                {/* Logout */}
                <div className={`border-t py-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <button 
                    onClick={() => {
                      // Handle logout logic
                      setShowProfileDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors ${
                      isDarkMode 
                        ? 'text-red-400 hover:bg-red-900/20' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="main-layout flex max-w-screen-2xl mx-auto px-12 pt-12 gap-8 items-start">
        {/* Left Navigation Strip */}
        <div className="sidebar-navigation w-72">
          <div className={`sidebar-card w-full rounded-xl shadow-sm sticky top-28 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Primary Navigation */}
            <div className="primary-nav-section p-6 space-y-3">
              <button 
                onClick={() => setActiveSection('explore')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'explore'
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : `${isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400' 
                        : 'text-gray-700 hover:bg-blue-50'
                      }`
                }`}
              >
                {t('exploreOffers')}
              </button>
              
              <button 
                onClick={() => setActiveSection('saved')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'saved'
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : `${isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400' 
                        : 'text-gray-700 hover:bg-blue-50'
                      }`
                }`}
              >
                {t('savedOffers')}
              </button>
              
              <button 
                onClick={() => setActiveSection('applications')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'applications'
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : `${isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400' 
                        : 'text-gray-700 hover:bg-blue-50'
                      }`
                }`}
              >
                {t('myApplications')}
              </button>
            </div>

            {/* Separator */}
            <div className={`nav-separator border-t mx-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>

            {/* Skills Validation Dropdown */}
            <div className="skills-validation-section p-6">
              <button 
                onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                className={`skills-dropdown-trigger w-full flex items-center justify-between px-4 py-3 rounded-lg text-left text-sm font-semibold transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400' 
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                <span>{t('skillsValidation')}</span>
                <ChevronDownIcon className={`dropdown-icon w-4 h-4 ml-2 transition-transform ${showSkillsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Skills Categories Sub-options */}
              {showSkillsDropdown && (
                <div className="skills-dropdown-menu mt-3 pl-4 space-y-2 max-h-48 overflow-y-auto">
                  {skillCategories.map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => handleSkillCategoryClick(skill)}
                      className={`skill-category-item block w-full text-left pl-4 pr-2 py-2 text-xs transition-colors rounded ${
                        activeSection === skillToTestMap[skill.toLowerCase()] || activeSection === `skill-${skill.toLowerCase().replace(/\s+/g, '-')}`
                          ? 'bg-blue-50 text-blue-500 font-semibold border-l-2 border-blue-500'
                          : `${isDarkMode 
                              ? 'text-gray-400 hover:bg-gray-700 hover:text-blue-400' 
                              : 'text-gray-700 hover:bg-blue-50 hover:text-blue-500'
                            }`
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Separator */}
            <div className={`nav-separator border-t mx-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>

            {/* Additional Navigation Items */}
            <div className="secondary-nav-section p-6 space-y-3">
              <button 
                onClick={() => setActiveSection('mon-espace')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'mon-espace'
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : `${isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400' 
                        : 'text-gray-700 hover:bg-blue-50'
                      }`
                }`}
              >
                {t('mySpace')}
              </button>
              
              <button 
                onClick={() => setActiveSection('offres-recommandees')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'offres-recommandees'
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : `${isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400' 
                        : 'text-gray-700 hover:bg-blue-50'
                      }`
                }`}
              >
                {t('recommendedOffers')}
              </button>
              
              <button 
                onClick={() => setActiveSection('historique-tests')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'historique-tests'
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : `${isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400' 
                        : 'text-gray-700 hover:bg-blue-50'
                      }`
                }`}
              >
                {t('testHistory')}
              </button>
            </div>
          </div>
        </div>

        {/* Central Content Zone */}
        <div className="main-content-area flex-1 max-w-4xl">
          {activeSection === 'dashboard' ? (
            <Dashboard isDarkMode={isDarkMode} />
          ) : activeSection === 'test-session' ? (
            <TestLayout />
          ) : activeSection === 'available-tests' || activeSection.includes('-tests') ? (
            // Show AvailableTests for most test categories
            activeSection === 'technical-tests' ? (
              <TechnicalTests onBackToDashboard={() => setActiveSection('applications')} />
            ) : (
              <AvailableTests 
                onBackToDashboard={() => setActiveSection('applications')} 
                onStartTest={() => setActiveSection('test-session')}
              />
            )
          ) : activeSection.startsWith('skill-') ? (
            // Skills Practice Content
            <div className="skills-practice-content space-y-6">
              <div className="skills-header text-center py-12">
                <h1 className={`page-title text-3xl font-bold mb-4 transition-colors ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {activeSection.split('skill-')[1].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} - {t('practiceTitle')}
                </h1>
                <p className={`page-description text-lg max-w-3xl mx-auto transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {t('improveSkills')}
                </p>
              </div>
              
              <div className={`skills-card rounded-xl shadow-sm p-8 transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h2 className={`card-title text-xl font-semibold mb-4 transition-colors ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {activeSection.split('skill-')[1].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h2>
                <p className={`card-description mb-6 transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {t('interactiveAssessments')}
                </p>
                <button 
                  onClick={() => setActiveSection('available-tests')}
                  className="start-assessment-btn bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-sm transition-colors"
                >
                  {t('startAssessment')}
                </button>
              </div>
            </div>
          ) : activeSection === 'mon-espace' ? (
            <div className="space-y-6">
              <div className="text-center py-12">
                <h1 className={`text-3xl font-bold mb-4 transition-colors ${
                  isDarkMode ? 'text-gray-100' : 'text-[#4A5869]'
                }`}>{t('mySpace')}</h1>
                <p className={`text-lg max-w-3xl mx-auto transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-[#4A5869]/70'
                }`}>
                  {currentLanguage === 'fr' 
                    ? 'Gérez votre profil, vos préférences et vos paramètres personnels.'
                    : 'Manage your profile, preferences and personal settings.'
                  }
                </p>
              </div>
              <div className={`rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-8 transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h2 className={`text-xl font-semibold mb-4 transition-colors ${
                  isDarkMode ? 'text-gray-100' : 'text-[#4A5869]'
                }`}>
                  {t('personalSpace')}
                </h2>
                <p className={`transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-[#4A5869]/70'
                }`}>
                  {t('personalSpaceImplemented')}
                </p>
              </div>
            </div>
          ) : activeSection === 'offres-recommandees' ? (
            <div className="space-y-6">
              <div className="text-center py-12">
                <h1 className={`text-3xl font-bold mb-4 transition-colors ${
                  isDarkMode ? 'text-gray-100' : 'text-[#4A5869]'
                }`}>{t('recommendedOffers')}</h1>
                <p className={`text-lg max-w-3xl mx-auto transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-[#4A5869]/70'
                }`}>
                  {t('personalizedJobOffers')}
                </p>
              </div>
              <div className={`rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-8 transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h2 className={`text-xl font-semibold mb-4 transition-colors ${
                  isDarkMode ? 'text-gray-100' : 'text-[#4A5869]'
                }`}>
                  {t('personalizedRecommendations')}
                </h2>
                <p className={`transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-[#4A5869]/70'
                }`}>
                  {t('recommendationSystemImplemented')}
                </p>
              </div>
            </div>
          ) : activeSection === 'historique-tests' ? (
            <div className="space-y-6">
              <div className="text-center py-12">
                <h1 className={`text-3xl font-bold mb-4 transition-colors ${
                  isDarkMode ? 'text-gray-100' : 'text-[#4A5869]'
                }`}>{t('testHistory')}</h1>
                <p className={`text-lg max-w-3xl mx-auto transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-[#4A5869]/70'
                }`}>
                  {t('reviewTestHistory')}
                </p>
              </div>
              <div className={`rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-8 transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h2 className={`text-xl font-semibold mb-4 transition-colors ${
                  isDarkMode ? 'text-gray-100' : 'text-[#4A5869]'
                }`}>
                  {t('completeHistory')}
                </h2>
                <p className={`transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-[#4A5869]/70'
                }`}>
                  {t('testHistoryImplemented')}
                </p>
              </div>
            </div>
          ) : activeSection === 'profile' ? (
            <div className="space-y-6">
              <div className="text-center py-12">
                <h1 className={`text-3xl font-bold mb-4 transition-colors ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {t('profile')}
                </h1>
                <p className={`text-lg max-w-3xl mx-auto transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {t('manageProfile')}
                </p>
              </div>
              
              {/* Profile Information Card */}
              <div className={`rounded-xl shadow-sm p-8 transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center space-x-6 mb-8">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">YA</span>
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 transition-colors ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-800'
                    }`}>Yassine</h2>
                    <p className={`text-lg transition-colors ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>yassine@jobgate.com</p>
                    <p className={`text-sm transition-colors ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {t('developer')} • {t('level')} 3
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className={`p-6 rounded-lg transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-4 transition-colors ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-800'
                    }`}>
                      {t('personalInformation')}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className={`text-sm font-medium transition-colors ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {t('fullName')}
                        </label>
                        <p className={`mt-1 transition-colors ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-800'
                        }`}>Yassine</p>
                      </div>
                      <div>
                        <label className={`text-sm font-medium transition-colors ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>{t('email')}</label>
                        <p className={`mt-1 transition-colors ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-800'
                        }`}>yassine@jobgate.com</p>
                      </div>
                      <div>
                        <label className={`text-sm font-medium transition-colors ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {t('location')}
                        </label>
                        <p className={`mt-1 transition-colors ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-800'
                        }`}>Casablanca, {t('morocco')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills & Experience */}
                  <div className={`p-6 rounded-lg transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-4 transition-colors ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-800'
                    }`}>
                      {t('skills')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {['Java', 'Python', 'React', 'Node.js', 'Docker'].map((skill) => (
                        <span key={skill} className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          isDarkMode 
                            ? 'bg-blue-900/30 text-blue-300' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4">
                      <label className={`text-sm font-medium transition-colors ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {t('experience')}
                      </label>
                      <p className={`mt-1 transition-colors ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-800'
                      }`}>
                        2+ {t('years')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex space-x-4">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                    {t('editProfile')}
                  </button>
                  <button className={`px-6 py-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}>
                    {t('changePassword')}
                  </button>
                </div>
              </div>
            </div>
          ) : activeSection === 'settings' ? (
            <div className="space-y-6">
              <div className="text-center py-12">
                <h1 className={`text-3xl font-bold mb-4 transition-colors ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {t('settings')}
                </h1>
                <p className={`text-lg max-w-3xl mx-auto transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {t('configureSettings')}
                </p>
              </div>
              <div className={`rounded-xl shadow-sm p-8 transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h2 className={`text-xl font-semibold mb-4 transition-colors ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {t('generalSettings')}
                </h2>
                <p className={`transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {t('appSettingsImplemented')}
                </p>
              </div>
            </div>
          ) : activeSection === 'notifications' ? (
            <div className="space-y-6">
              <div className="text-center py-12">
                <h1 className={`text-3xl font-bold mb-4 transition-colors ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {t('notifications')}
                </h1>
                <p className={`text-lg max-w-3xl mx-auto transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {t('viewNotifications')}
                </p>
              </div>
              <div className={`rounded-xl shadow-sm p-8 transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h2 className={`text-xl font-semibold mb-4 transition-colors ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {t('recentNotifications')}
                </h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((notif) => (
                    <div key={notif} className={`p-4 rounded-lg border transition-colors ${
                      isDarkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <p className={`font-medium transition-colors ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-800'
                      }`}>
                        {t('newJobOffer')}
                      </p>
                      <p className={`text-sm transition-colors ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {t('hoursAgo')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeSection === 'help' ? (
            <div className="space-y-6">
              <div className="text-center py-12">
                <h1 className={`text-3xl font-bold mb-4 transition-colors ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {t('help')}
                </h1>
                <p className={`text-lg max-w-3xl mx-auto transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {t('findHelp')}
                </p>
              </div>
              <div className={`rounded-xl shadow-sm p-8 transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h2 className={`text-xl font-semibold mb-4 transition-colors ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {t('helpCenter')}
                </h2>
                <p className={`transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {t('helpCenterImplemented')}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Blue Banner Header */}
              <div className={`career-banner rounded-lg p-8 mb-6 relative overflow-hidden transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800' : 'bg-slate-800'
              }`}>
                <div className="banner-content flex items-center justify-between">
                  <div className="banner-text flex-1 pr-8">
                    <h1 className="banner-title text-white text-2xl font-medium mb-6 leading-tight">
                      {t('developPotential')}
                    </h1>
                    <p className="banner-description text-white/80 text-sm leading-relaxed max-w-lg">
                      {t('expertAdvice')}
                    </p>
                  </div>
                  
                  {/* Carousel */}
                  <div className="career-carousel relative w-full max-w-xl overflow-hidden rounded-xl shadow-lg">
                    <div 
                      className="carousel-slider flex transition-transform duration-700 ease-in-out"
                      style={{ transform: `translateX(-${currentCarouselIndex * 100}%)` }}
                    >
                      {carouselImages.map((item, index) => (
                        <div key={index} className="carousel-slide w-full flex-shrink-0">
                          <div className="slide-card overflow-hidden w-full h-64 relative group">
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="slide-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="slide-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                            <div className="slide-content absolute bottom-6 left-6 right-6 text-white">
                              <h3 className="slide-title font-bold text-lg mb-2 text-shadow-lg leading-tight">{item.title}</h3>
                              <p className="slide-subtitle text-white/95 text-sm leading-relaxed text-shadow-md">{item.subtitle}</p>
                            </div>
                            
                            {/* Decorative element */}
                            <div className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Carousel Controls */}
                    <button 
                      onClick={prevSlide}
                      className="carousel-prev-btn absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/25 hover:bg-white/40 backdrop-blur-sm rounded-full p-3 transition-all duration-300 z-10 hover:scale-110 shadow-lg"
                    >
                      <ChevronLeftIcon className="prev-icon w-5 h-5 text-white drop-shadow-md" />
                    </button>
                    <button 
                      onClick={nextSlide}
                      className="carousel-next-btn absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/25 hover:bg-white/40 backdrop-blur-sm rounded-full p-3 transition-all duration-300 z-10 hover:scale-110 shadow-lg"
                    >
                      <ChevronRightIcon className="next-icon w-5 h-5 text-white drop-shadow-md" />
                    </button>
                    
                    {/* Dots Indicator */}
                    <div className="carousel-indicators absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center space-x-3 z-10">
                      {carouselImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentCarouselIndex(index)}
                          className={`indicator-dot transition-all duration-300 rounded-full ${
                            index === currentCarouselIndex 
                              ? 'bg-white w-8 h-3 shadow-lg' 
                              : 'bg-white/50 hover:bg-white/75 w-3 h-3 hover:scale-110'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Offers Card */}
              <div className={`job-offers-card rounded-xl shadow-sm p-6 transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="offers-header flex items-center justify-between mb-4">
                  <h2 className={`offers-title font-medium text-lg ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>{t('offers')}</h2>
                  <button className={`view-all-btn text-sm hover:underline transition-colors ${
                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'
                  }`}>{t('viewAll')}</button>
                </div>
                
                {/* Job Offer Card */}
                <div className={`job-offer-item border rounded-lg p-4 transition-colors duration-300 ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="offer-content flex items-start space-x-4">
                    {/* Company Logo */}
                    <div className="company-logo w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      J
                    </div>
                    
                    {/* Job Details */}
                    <div className="job-details flex-1">
                      <h3 className={`job-title font-medium mb-1 ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-800'
                      }`}>{t('backendDeveloper')}</h3>
                      <p className={`company-name text-sm mb-2 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>JOBGATE</p>
                      <p className={`job-location text-sm mb-3 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>📍 Casablanca, Maroc</p>
                      
                      {/* Tags */}
                      <div className="job-tags flex space-x-2 mb-3">
                        <span className={`job-tag px-2 py-1 rounded text-xs transition-colors ${
                          isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-500'
                        }`}>Stage</span>
                        <span className={`job-tag px-2 py-1 rounded text-xs transition-colors ${
                          isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-500'
                        }`}>Télétravail</span>
                        <span className={`job-tag px-2 py-1 rounded text-xs transition-colors ${
                          isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-500'
                        }`}>3 mois</span>
                      </div>
                      
                      <p className={`job-description text-sm mb-4 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-800'
                      }`}>
                        À propos JOBGATE: JOBGATE est une plateforme de recrutement en ligne leader qui connecte les professionnels talentueux avec les meilleurs employeurs...
                      </p>
                      
                      <button className={`view-more-btn px-4 py-2 rounded text-sm transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}>
                        {t('viewMore')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Side Strip */}
        <div className="right-sidebar w-18 flex justify-center">
          <button className={`floating-action-btn w-12 h-12 rounded-full flex items-center justify-center transition-colors sticky top-32 ${
            isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}>
            <span className="btn-icon text-white font-bold text-xs">J</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
