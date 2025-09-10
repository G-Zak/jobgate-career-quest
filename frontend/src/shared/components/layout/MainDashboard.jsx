import React, { useState, useEffect } from 'react';
import { 
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import Dashboard from '../../../features/candidate-dashboard/components/DashboardCandidat';
import AvailableTests from '../../../features/skills-assessment/components/AvailableTests';
import TechnicalTests from '../../../features/skills-assessment/components/TechnicalTests';
import TestLayout from '../../../features/skills-assessment/components/TestLayout';
import VerbalReasoningTest from '../../../features/skills-assessment/components/VerbalReasoningTest';
import ProfilePage from '../../../features/profile/components/ProfilePage';
import SpatialReasoningTest from '../../../features/skills-assessment/components/SpatialReasoningTest';
import DiagrammaticReasoningTest from '../../../features/skills-assessment/components/DiagrammaticReasoningTest';
import AbstractReasoningTest from '../../../features/skills-assessment/components/AbstractReasoningTest';
import LogicalReasoningTest from '../../../features/skills-assessment/components/LogicalReasoningTest';
import LRT2Test from '../../../features/skills-assessment/components/LRT2Test';
import LRT3Test from '../../../features/skills-assessment/components/LRT3Test';
import SituationalJudgmentTest from '../../../features/skills-assessment/components/SituationalJudgmentTest';
import MasterSJTTest from '../../../features/skills-assessment/components/MasterSJTTest';
import SkillsSelector from '../../../features/skills-assessment/components/SkillsSelector';
import TechnicalTest from '../../../features/skills-assessment/components/TechnicalTest';
// AdaptiveTest supprimé - les tests sont créés par l'admin
import SkillBasedTests from '../../../features/skills-assessment/components/SkillBasedTests';
import TestAdministration from '../../../features/skills-assessment/components/TestAdministration';
import TestDebugPage from '../../../features/skills-assessment/components/TestDebugPage';
import TestHistoryDashboard from '../../../features/candidate-dashboard/components/TestHistoryDashboard';
import JobRecommendationsPage from '../../../features/job-recommendations/components/JobRecommendationsPage';
import { ChallengesList, ChallengeDetail, CodingDashboard } from '../../../features/coding-challenges/components';
import DebugChallenges from '../../../features/coding-challenges/components/DebugChallenges';
import SkillTestsOverview from '../../../features/skills-assessment/components/SkillTestsOverview';
import PracticalTests from '../../../features/coding-challenges/components/PracticalTests';
import jobgateLogo from '../../../assets/images/ui/JOBGATE LOGO.png';
import formationEnLigne from '../../../assets/images/ui/formation_en_ligne.avif';
import { useScrollOnChange } from '../../utils/scrollUtils';
import formationTechnique from '../../../assets/images/ui/formation_technique.avif';
import betterImpressions from '../../../assets/images/ui/better_impressions.avif';

const MainDashboard = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [activeSection, setActiveSection] = useState('applications');
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [currentTestFilter, setCurrentTestFilter] = useState(null);
  const [currentTestId, setCurrentTestId] = useState(null);
  const [currentSkillId, setCurrentSkillId] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  // Universal scroll management using scroll utilities
  useScrollOnChange(activeSection, { smooth: true, attempts: 3 });
  useScrollOnChange(currentTestId, { smooth: true, attempts: 3 });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
      if (!event.target.closest('#skills-validation')) {
        setShowSkillsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Lock body scroll on test views so only the test area scrolls
  useEffect(() => {
    const isTestView = (
      activeSection === 'spatial-reasoning-test' ||
      activeSection === 'diagrammatic-reasoning-test' ||
      activeSection === 'abstract-reasoning-test' ||
      activeSection === 'logical-reasoning-test' ||
      activeSection === 'lrt2-test' ||
      activeSection === 'lrt3-test' ||
      activeSection === 'test-session' ||
      (typeof activeSection === 'string' && activeSection.startsWith('verbal-reasoning-test'))
    );

    if (isTestView) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow || '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [activeSection]);

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
    
    // Set the filter based on the skill category
    setCurrentTestFilter(normalizedSkill);
    setActiveSection('available-tests');
    // Keep dropdown open - don't close it automatically
  };

  const handleStartTest = (testId, skillId = null) => {
  const isMasterSJT = (typeof testId === 'string' && (testId === 'MASTER-SJT' || testId === 'MASTER-SJT1' || testId.toLowerCase().includes('master-sjt')));
  const isSJT = (typeof testId === 'string' && (testId === 'SJT' || testId.toLowerCase().includes('situational') || testId.toLowerCase().includes('sjt')));
    console.log('=== HANDLE START TEST ===');
    console.log('testId:', testId, 'Type:', typeof testId);
    console.log('currentTestFilter:', currentTestFilter);
    
    const isVerbalComprehensive = testId === 'VERBAL_COMPREHENSIVE';
    const isVerbalFilterAndNumber = (currentTestFilter === 'verbal' && typeof testId === 'number');
    const isStringWithVerbal = (typeof testId === 'string' && testId.toLowerCase().includes('verbal'));
    const isVRTString = (typeof testId === 'string' && testId.startsWith('VRT'));
    
    const isSpatialFilterAndNumber = (currentTestFilter === 'spatial' && typeof testId === 'number');
    const isStringWithSpatial = (typeof testId === 'string' && testId.toLowerCase().includes('spatial'));
    const isSRTString = (typeof testId === 'string' && testId.startsWith('SRT'));
    
    const isDiagrammaticFilterAndNumber = (currentTestFilter === 'diagrammatic' && typeof testId === 'number');
    const isStringWithDiagrammatic = (typeof testId === 'string' && testId.toLowerCase().includes('diagrammatic'));
    const isDRTString = (typeof testId === 'string' && testId.startsWith('DRT'));
    
    const isAbstractFilterAndNumber = (currentTestFilter === 'abstract' && typeof testId === 'number');
    const isStringWithAbstract = (typeof testId === 'string' && testId.toLowerCase().includes('abstract'));
    const isARTString = (typeof testId === 'string' && testId.startsWith('ART'));
    
    const isLogicalFilterAndNumber = (currentTestFilter === 'logical' && typeof testId === 'number');
    const isStringWithLogical = (typeof testId === 'string' && testId.toLowerCase().includes('logical'));
    const isLRTString = (typeof testId === 'string' && testId.startsWith('LRT') && !testId.startsWith('LRT2') && !testId.startsWith('LRT3'));
    const isLRT2String = (typeof testId === 'string' && testId.startsWith('LRT2'));
    const isLRT3String = (typeof testId === 'string' && testId.startsWith('LRT3'));
    
    console.log('isVerbalComprehensive:', isVerbalComprehensive);
    console.log('isVerbalFilterAndNumber:', isVerbalFilterAndNumber);
    console.log('isStringWithVerbal:', isStringWithVerbal);
    console.log('isVRTString:', isVRTString);
    console.log('isSpatialFilterAndNumber:', isSpatialFilterAndNumber);
    console.log('isStringWithSpatial:', isStringWithSpatial);
    console.log('isSRTString:', isSRTString);
    console.log('isDiagrammaticFilterAndNumber:', isDiagrammaticFilterAndNumber);
    console.log('isStringWithDiagrammatic:', isStringWithDiagrammatic);
    console.log('isDRTString:', isDRTString);
    console.log('isAbstractFilterAndNumber:', isAbstractFilterAndNumber);
    console.log('isStringWithAbstract:', isStringWithAbstract);
    console.log('isARTString:', isARTString);
    console.log('isLogicalFilterAndNumber:', isLogicalFilterAndNumber);
    console.log('isStringWithLogical:', isStringWithLogical);
    console.log('isLRTString:', isLRTString);
    console.log('isLRT2String:', isLRT2String);
    console.log('isLRT3String:', isLRT3String);
    
  // Set the current test ID and skill ID
    setCurrentTestId(testId);
    setCurrentSkillId(skillId);
    
    // Check if it's a verbal reasoning test
    if (isMasterSJT) {
      console.log('✅ Routing to Master SJT');
      setActiveSection('master-sjt');
    } else if (isSJT) {
      console.log('✅ Routing to Situational Judgment Test');
      setActiveSection('situational-judgment-test');
    } else if (isVerbalComprehensive || isVerbalFilterAndNumber || isStringWithVerbal || isVRTString) {
      // Extract language from test ID if it's comprehensive
      const language = testId.toString().includes('_FRENCH') ? 'french' : 'english';
      console.log('✅ Routing to verbal reasoning test with language:', language);
      setActiveSection(`verbal-reasoning-test-${language}`);
    } else if (isSpatialFilterAndNumber || isStringWithSpatial || isSRTString) {
      // Handle spatial reasoning tests
      console.log('✅ Routing to spatial reasoning test');
      setActiveSection('spatial-reasoning-test');
    } else if (isDiagrammaticFilterAndNumber || isStringWithDiagrammatic || isDRTString) {
      // Handle diagrammatic reasoning tests
      console.log('✅ Routing to diagrammatic reasoning test');
      setActiveSection('diagrammatic-reasoning-test');
    } else if (isAbstractFilterAndNumber || isStringWithAbstract || isARTString) {
      // Handle abstract reasoning tests
      console.log('✅ Routing to abstract reasoning test');
      setActiveSection('abstract-reasoning-test');
    } else if (isLogicalFilterAndNumber || isStringWithLogical || isLRTString) {
      // Handle logical reasoning tests (Section 1)
      console.log('✅ Routing to logical reasoning test');
      setActiveSection('logical-reasoning-test');
    } else if (isLRT2String) {
      // Handle LRT2 tests (Section 2)
      console.log('✅ Routing to LRT2 test');
      setActiveSection('lrt2-test');
    } else if (isLRT3String) {
      // Handle LRT3 tests (Section 3)
      console.log('✅ Routing to LRT3 test');
      setActiveSection('lrt3-test');
    } else {
      // Check if it's a custom QCM test from our skill-based system
      const isCustomQCMTest = (typeof testId === 'number' && testId >= 1 && testId <= 100) || 
                             (typeof testId === 'string' && testId.includes('test'));
      
      if (isCustomQCMTest) {
        console.log('✅ Routing to technical-assessment for custom QCM test:', testId);
        setActiveSection('technical-assessment');
      } else {
        // Handle other test types (numerical, etc.)
        console.log('❌ Routing to test-session for testId:', testId);
        setActiveSection('test-session');
      }
    }
  };

  const handleSelectChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setActiveSection(`challenge-${challenge.id}`);
  };

  const handleBackFromChallenge = () => {
    setSelectedChallenge(null);
    setActiveSection('coding-challenges');
  };

  const nextSlide = () => {
    setCurrentCarouselIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div id="dashboard-root" className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Header Bar */}
      <div id="app-header" className="header-bar h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-12 fixed top-0 left-0 right-0 z-20">
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
          <nav id="main-nav" className="main-navigation flex items-center space-x-8">
            <button 
              onClick={() => setActiveSection('dashboard')}
              className={`nav-button text-base font-medium transition-colors pb-1 ${
                activeSection === 'dashboard' 
                  ? 'text-blue-500 border-b-2 border-blue-500' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'
              }`}
            >
              Tableau de bord
            </button>
            
            <button 
              onClick={() => setActiveSection('jobs')}
              className={`nav-button text-base font-medium transition-colors pb-1 ${
                activeSection === 'jobs' 
                  ? 'text-blue-500 border-b-2 border-blue-500' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'
              }`}
            >
              Offres d'emploi
            </button>
            
            <button 
              onClick={() => setActiveSection('career')}
              className={`nav-button text-base font-medium transition-colors pb-1 ${
                activeSection === 'career' 
                  ? 'text-blue-500 border-b-2 border-blue-500' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'
              }`}
            >
              Conseils de carrière
            </button>
          </nav>

          {/* Right Avatar */}
          <div className="relative profile-dropdown-container">
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="user-avatar w-8 h-8 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors flex items-center justify-center"
            >
              <UserCircleIcon className="w-6 h-6 text-gray-600" />
            </button>
            
            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                {/* User Info Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      YA
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">Yassine</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">yassine@jobgate.com</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {/* Profile */}
                  <button
                    onClick={() => {
                      setActiveSection('profile');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <UserCircleIcon className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                    <span>Profile</span>
                  </button>

                  {/* Settings */}
                  <button
                    onClick={() => {
                      setActiveSection('settings');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Settings</span>
                  </button>

                  {/* Notifications */}
                  <button
                    onClick={() => {
                      setActiveSection('notifications');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Notifications</span>
                    </div>
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">3</span>
                  </button>

                  {/* Language Section */}
                  <div className="px-4 py-2">
                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">LANGUAGE</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      console.log('Language settings');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      <span>English</span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">EN</span>
                  </button>

                  {/* Appearance Section */}
                  <div className="px-4 py-2 mt-2">
                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">APPEARANCE</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleDarkMode();
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span>Dark Mode</span>
                    </div>
                    <div 
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${isDarkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDarkMode();
                      }}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ${isDarkMode ? 'translate-x-4' : 'translate-x-0.5'}`}></span>
                    </div>
                  </button>

                  {/* Help & Support */}
                  <button
                    onClick={() => {
                      setActiveSection('help');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Help & Support</span>
                  </button>

                  {/* Divider */}
                  <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

                  {/* Sign Out */}
                  <button
                    onClick={() => {
                      console.log('Sign out');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div id="dashboard-layout" className="main-layout flex max-w-screen-2xl mx-auto px-12 pt-28 gap-8 items-start">
        {/* Left Navigation Strip */}
        <div id="sidebar" className="sidebar-navigation w-72">
          <div className="sidebar-card w-72 bg-white dark:bg-gray-800 rounded-xl shadow-sm fixed top-28 h-[calc(100vh-8rem)] overflow-y-auto z-10">
            {/* Primary Navigation */}
            <div className="primary-nav-section p-6 space-y-3">
              <button 
                onClick={() => setActiveSection('explore')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'explore'
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                Explorer les offres
              </button>
              
              <button 
                onClick={() => setActiveSection('saved')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'saved'
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                Offres sauvegardées
              </button>
              
              <button 
                onClick={() => setActiveSection('applications')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'applications'
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                Mes candidatures
              </button>
            </div>

            {/* Separator */}
            <div className="nav-separator border-t border-gray-200 mx-6"></div>

            {/* Skills Validation Dropdown */}
            <div id="skills-validation" className="skills-validation-section p-6">
              <button 
                onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                className="skills-dropdown-trigger w-full flex items-center justify-between px-4 py-3 rounded-lg text-left text-gray-700 text-sm font-semibold transition-colors hover:bg-blue-50"
              >
                <span>Validation des compétences</span>
                <ChevronDownIcon className={`dropdown-icon w-4 h-4 ml-2 transition-transform ${showSkillsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Skills Categories Sub-options */}
              {showSkillsDropdown && (
                <div id="skills-dropdown" className="skills-dropdown-menu mt-3 pl-4 space-y-2 max-h-48 overflow-y-auto">
                  {skillCategories.map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => handleSkillCategoryClick(skill)}
                      className={`skill-category-item block w-full text-left pl-4 pr-2 py-2 text-xs transition-colors rounded ${
                        activeSection === skillToTestMap[skill.toLowerCase()] || activeSection === `skill-${skill.toLowerCase().replace(/\s+/g, '-')}`
                          ? 'bg-blue-50 text-blue-500 font-semibold border-l-2 border-blue-500'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-500'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="nav-separator border-t border-gray-200 mx-6"></div>

            {/* Additional Navigation Items */}
            <div className="secondary-nav-section p-6 space-y-3">
              <button 
                onClick={() => setActiveSection('skills-management')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'skills-management'
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                Gestion des compétences
              </button>
              
              <button 
                onClick={() => setActiveSection('tests-by-competencies')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'tests-by-competencies'
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                📝 Tests par Compétences
              </button>
              
              <button 
                onClick={() => setActiveSection('practical-tests')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'practical-tests'
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                💻 Tests Pratiques
              </button>
              
              <button 
                onClick={() => setActiveSection('coding-challenges')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'coding-challenges' || activeSection === 'coding-dashboard' || activeSection.startsWith('challenge-')
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                � Debug: Défis
              </button>
              
              <button 
                onClick={() => setActiveSection('technical-assessment')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'technical-assessment'
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                � Debug: QCM Skills
              </button>
              
              {/* Test adaptatif supprimé - tests créés par l'admin */}
              
              {/* Administration supprimée - tests créés par l'admin Django */}
              
              <button 
                onClick={() => setActiveSection('test-debug')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'test-debug'
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                🔧 Debug Tests API
              </button>
              
              <button 
                onClick={() => setActiveSection('profile')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'profile'
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
                }`}
              >
                Mon espace
              </button>
              
              <button 
                onClick={() => setActiveSection('offres-recommandees')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'offres-recommandees'
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                Offres recommandées
              </button>
              
              <button 
                onClick={() => setActiveSection('historique-tests')}
                className={`sidebar-nav-item w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-semibold text-sm transition-colors ${
                  activeSection === 'historique-tests'
                    ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                Historique des tests
              </button>
            </div>
          </div>
        </div>

        {/* Central Content Zone */}
        <div id="main-content" className="main-content-area flex-1 max-w-4xl">
          {/* Scrollable Content Container */}
          <div className="h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden">
            {/* Debug info (hidden by default) */}
            {false && (
              <div style={{position: 'fixed', top: 0, right: 0, background: 'yellow', padding: '10px', zIndex: 9999, fontSize: '12px'}}>
                ActiveSection: {activeSection}<br/>
                CurrentTestId: {currentTestId}<br/>
                CurrentTestFilter: {currentTestFilter}
              </div>
            )}
          
          {activeSection === 'dashboard' ? (
            <Dashboard onNavigateToSection={setActiveSection} />
          ) : activeSection === 'test-session' ? (
            <TestLayout />
          ) : activeSection.startsWith('verbal-reasoning-test') ? (
            <VerbalReasoningTest 
              onBackToDashboard={() => setActiveSection('available-tests')} 
              language={activeSection.includes('french') ? 'french' : 'english'}
              testId={currentTestId}
            />
          ) : activeSection === 'spatial-reasoning-test' ? (
            <SpatialReasoningTest 
              onBackToDashboard={() => setActiveSection('available-tests')} 
              testId={currentTestId}
            />
          ) : activeSection === 'diagrammatic-reasoning-test' ? (
            <DiagrammaticReasoningTest 
              onBackToDashboard={() => setActiveSection('available-tests')} 
              testId={currentTestId}
            />
          ) : activeSection === 'abstract-reasoning-test' ? (
            <AbstractReasoningTest 
              onBackToDashboard={() => setActiveSection('available-tests')} 
              testId={currentTestId}
            />
          ) : activeSection === 'logical-reasoning-test' ? (
            <LogicalReasoningTest 
              onBackToDashboard={() => setActiveSection('available-tests')} 
              testId={currentTestId}
            />
          ) : activeSection === 'lrt2-test' ? (
            <LRT2Test 
              onBackToDashboard={() => setActiveSection('available-tests')} 
              testId={currentTestId}
            />
          ) : activeSection === 'lrt3-test' ? (
            <LRT3Test 
              onBackToDashboard={() => setActiveSection('available-tests')} 
              testId={currentTestId}
            />
          ) : activeSection === 'skills-management' ? (
            <SkillsSelector 
              userId={1} 
              onSkillsUpdated={() => console.log('Skills updated')}
            />
          ) : activeSection === 'tests-by-competencies' ? (
            <SkillTestsOverview 
              onBackToDashboard={() => setActiveSection('applications')} 
              onStartTest={handleStartTest}
              userId={1} 
            />
          ) : activeSection === 'practical-tests' ? (
            <PracticalTests onBackToDashboard={() => setActiveSection('applications')} />
          ) : activeSection === 'technical-assessment' ? (
            <SkillBasedTests 
              userId={1}
              testId={currentTestId}
              skillId={currentSkillId}
              onBackToDashboard={() => setActiveSection('applications')}
            />
          ) : activeSection === 'situational-judgment-test' ? (
            <SituationalJudgmentTest 
              onBackToDashboard={() => setActiveSection('available-tests')}
              testId={currentTestId}
            />
          ) : activeSection === 'master-sjt' ? (
            <MasterSJTTest 
              onClose={() => setActiveSection('available-tests')}
            />
          ) : activeSection === 'test-administration' ? (
            <TestAdministration 
              onBackToDashboard={() => setActiveSection('applications')}
            />
          ) : activeSection === 'test-debug' ? (
            <TestDebugPage />
          ) : activeSection === 'available-tests' || activeSection.includes('-tests') ? (
            // Show AvailableTests for most test categories
            activeSection === 'technical-tests' ? (
              <TechnicalTests onBackToDashboard={() => setActiveSection('applications')} />
            ) : (
              <AvailableTests 
                onBackToDashboard={() => setActiveSection('applications')} 
                onStartTest={handleStartTest}
                testFilter={currentTestFilter}
              />
            )
          ) : activeSection.startsWith('skill-') ? (
            // Skills Practice Content
            <div className="skills-practice-content space-y-6">
              <div className="skills-header text-center py-12">
                <h1 className="page-title text-3xl font-bold text-gray-800 mb-4">
                  {activeSection.split('skill-')[1].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} - Pratique
                </h1>
                <p className="page-description text-lg text-gray-600 max-w-3xl mx-auto">
                  Améliorez vos compétences grâce à des sessions de pratique complètes et suivez vos progrès dans cette catégorie de compétences.
                </p>
              </div>
              
              <div className="skills-card bg-white rounded-xl shadow-sm p-8">
                <h2 className="card-title text-xl font-semibold text-gray-800 mb-4">
                  {activeSection.split('skill-')[1].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h2>
                <p className="card-description text-gray-600 mb-6">
                  Les exercices d'évaluation et de pratique interactifs seront disponibles ici. Cette évaluation de catégorie de compétences est prête à commencer.
                </p>
                <button 
                  onClick={() => setActiveSection('available-tests')}
                  className="start-assessment-btn bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-sm transition-colors"
                >
                  Commencer l'évaluation
                </button>
              </div>
            </div>
          ) : activeSection === 'profile' ? (
            <ProfilePage />
          ) : activeSection === 'offres-recommandees' ? (
            <JobRecommendationsPage />
          ) : activeSection === 'historique-tests' ? (
            <TestHistoryDashboard />
          ) : activeSection === 'profile' ? (
            <ProfilePage />
          ) : activeSection === 'coding-challenges' ? (
            <ChallengesList onSelectChallenge={handleSelectChallenge} />
          ) : activeSection === 'coding-dashboard' ? (
            <CodingDashboard />
          ) : activeSection.startsWith('challenge-') ? (
            <ChallengeDetail 
              challenge={selectedChallenge} 
              onBack={handleBackFromChallenge}
            />
          ) : (
            <>
              {/* Blue Banner Header */}
              <div className="career-banner bg-slate-800 rounded-lg p-8 mb-6 relative overflow-hidden">
                <div className="banner-content flex items-center justify-between">
                  <div className="banner-text flex-1 pr-8">
                    <h1 className="banner-title text-white text-2xl font-medium mb-6 leading-tight">Développez votre potentiel professionnel</h1>
                    <p className="banner-description text-white/80 text-sm leading-relaxed max-w-lg">
                      Découvrez nos conseils d'experts, les tendances du marché et des recommandations pratiques pour ajuster votre parcours professionnel.
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
              <div className="job-offers-card bg-white rounded-xl shadow-sm p-6">
                <div className="offers-header flex items-center justify-between mb-4">
                  <h2 className="offers-title text-gray-800 font-medium text-lg">Offres</h2>
                  <button className="view-all-btn text-blue-500 text-sm hover:underline">Voir tout</button>
                </div>
                
                {/* Job Offer Card */}
                <div className="job-offer-item border border-gray-200 rounded-lg p-4">
                  <div className="offer-content flex items-start space-x-4">
                    {/* Company Logo */}
                    <div className="company-logo w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      J
                    </div>
                    
                    {/* Job Details */}
                    <div className="job-details flex-1">
                      <h3 className="job-title font-medium text-gray-800 mb-1">Développeur Backend</h3>
                      <p className="company-name text-gray-800 text-sm mb-2">JOBGATE</p>
                      <p className="job-location text-gray-800 text-sm mb-3">📍 Casablanca, Maroc</p>
                      
                      {/* Tags */}
                      <div className="job-tags flex space-x-2 mb-3">
                        <span className="job-tag bg-blue-50 text-blue-500 px-2 py-1 rounded text-xs">Stage</span>
                        <span className="job-tag bg-blue-50 text-blue-500 px-2 py-1 rounded text-xs">Télétravail</span>
                        <span className="job-tag bg-blue-50 text-blue-500 px-2 py-1 rounded text-xs">3 mois</span>
                      </div>
                      
                      <p className="job-description text-gray-800 text-sm mb-4">
                        À propos JOBGATE: JOBGATE est une plateforme de recrutement en ligne leader qui connecte les professionnels talentueux avec les meilleurs employeurs...
                      </p>
                      
                      <button className="view-more-btn bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm transition-colors">
                        Voir plus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          </div>
        </div>

        {/* Right Side Strip */}
        <div className="right-sidebar w-18 flex justify-center">
          <button className="floating-action-btn w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors sticky top-32">
            <span className="btn-icon text-white font-bold text-xs">J</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
