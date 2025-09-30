import React, { useState, useEffect } from 'react';
import {
  BookOpenIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TrophyIcon,
  ChartBarIcon,
  PlayIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  CpuChipIcon,
  CircleStackIcon,
  GlobeAltIcon,
  CommandLineIcon,
  SparklesIcon,
  FireIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { getUserSkillsWithFallback, getUserProfileWithFallback } from '../../../utils/skillsFallback';
import { getAllTechnicalTests, getTestBySkill } from '../../../data/mockTechnicalTests';
import { getUserTestStats, hasUserCompletedTest, getLatestTestResult } from '../../../utils/testScoring';
import TechnicalTestRunner from './TechnicalTestRunner';
import TestScoresPage from './TestScoresPage';

const SkillTestsOverview = ({ onBackToDashboard, onStartTest, userId = 1 }) => {
  console.log('🔍 SkillTestsOverview component rendered');

  const [userSkills, setUserSkills] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [recommendedTests, setRecommendedTests] = useState([]);
  const [mySkillsTests, setMySkillsTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [completedTests, setCompletedTests] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [lastUserId, setLastUserId] = useState(userId);
  const [stats, setStats] = useState({
    totalTests: 0,
    recommendedCount: 0,
    completedCount: 0,
    averageScore: 0
  });
  const [testsLoaded, setTestsLoaded] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [showTestRunner, setShowTestRunner] = useState(false);
  const [testStats, setTestStats] = useState(null);
  const [showScoresPage, setShowScoresPage] = useState(false);

  // Function to start a technical test
  const startTechnicalTest = (testId) => {
    const test = allTests.find(t => t.id === testId);
    if (test) {
      setCurrentTest(test);
      setShowTestRunner(true);
    }
  };

  // Function to retake a test (clear previous result and start fresh)
  const retakeTest = async (testId) => {
    console.log('🔄 Retaking test:', testId);

    try {
      // Import getTestResults dynamically to avoid module loading issues
      const { getTestResults: getTestResultsFunc } = await import('../../../utils/testScoring');

      // Check if getTestResults is available
      if (typeof getTestResultsFunc !== 'function') {
        console.error('❌ getTestResults is not a function:', typeof getTestResultsFunc);
        return;
      }

      // Clear the previous result from localStorage
      const existingResults = getTestResultsFunc(userId);
      console.log('📋 Existing results before filtering:', existingResults);

      const filteredResults = existingResults.filter(result => result.testId !== testId);
      console.log('📋 Filtered results:', filteredResults);

      localStorage.setItem(`testResults_${userId}`, JSON.stringify(filteredResults));
      console.log('✅ Previous test result cleared');

      // Start the test
      startTechnicalTest(testId);

    } catch (error) {
      console.error('❌ Error in retakeTest:', error);
    }
  };

  // Function to handle test completion
  const handleTestComplete = (result) => {
    console.log('🎯 Test completed, refreshing stats...');

    // Refresh test stats
    const stats = getUserTestStats(userId);
    setTestStats(stats);

    // Recalculate completed tests count
    const completedTestsCount = allTests.filter(test => isTestCompleted(test.id)).length;

    // Update local stats
    setStats(prev => ({
      ...prev,
      completedCount: completedTestsCount,
      averageScore: stats.averageScore
    }));

    // Close test runner
    setShowTestRunner(false);
    setCurrentTest(null);

    // Force component re-render to update test cards
    setTestsLoaded(false);
    setTimeout(() => setTestsLoaded(true), 100);
  };

  // Function to go back from test runner
  const handleBackFromTest = () => {
    setShowTestRunner(false);
    setCurrentTest(null);
  };

  // Function to check if a test has been completed (regardless of pass/fail)
  const isTestCompleted = (testId) => {
    const latestResult = getLatestTestResult(userId, testId);
    const completed = latestResult !== null;
    if (completed) {
      console.log(`✅ Test ${testId} is completed:`, latestResult.result);
    }
    return completed; // Test is completed if there's any result
  };

  // Function to get test completion info
  const getTestCompletionInfo = (testId) => {
    const latestResult = getLatestTestResult(userId, testId);
    if (!latestResult) return null;

    return {
      completed: true,
      passed: latestResult.result.passed,
      score: latestResult.result.score,
      percentage: latestResult.result.percentage,
      completedAt: latestResult.completedAt,
      timeSpent: latestResult.timeSpent
    };
  };

  // Function to clean up duplicate profiles in localStorage
  const cleanupLocalStorageProfiles = () => {
    const profiles = [];
    const keysToRemove = [];

    // Collect all profiles
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('userProfile_')) {
        const saved = localStorage.getItem(key);
        if (saved) {
          try {
            const profile = JSON.parse(saved);
            profiles.push({ key, profile, timestamp: profile.lastUpdated || 0 });
          } catch (error) {
            console.warn('Invalid profile data in localStorage:', key, error);
            keysToRemove.push(key);
          }
        }
      }
    }

    if (profiles.length > 1) {
      // Sort by timestamp (most recent first) and skills count
      profiles.sort((a, b) => {
        const aSkills = a.profile.skillsWithProficiency?.length || a.profile.skills?.length || 0;
        const bSkills = b.profile.skillsWithProficiency?.length || b.profile.skills?.length || 0;

        if (a.timestamp !== b.timestamp) {
          return b.timestamp - a.timestamp; // Most recent first
        }
        return bSkills - aSkills; // Most skills first
      });

      // Keep the best profile, remove others
      const bestProfile = profiles[0];
      const profilesToRemove = profiles.slice(1);

      profilesToRemove.forEach(profile => {
        keysToRemove.push(profile.key);
      });
    }

    // Remove duplicate profiles
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    return profiles.length > 0 ? profiles[0].profile : null;
  };


  // Mock data for fallback - plus complet et varié
  const mockTests = [
    {
      id: 1,
      test_name: 'Python Fundamentals Test',
      skill: { name: 'Python', category: 'programming' },
      description: 'Master the basics of Python programming',
      difficulty: 'Beginner',
      time_limit: 15,
      question_count: 20,
      total_score: 100,
      is_recommended: true,
      skill_demand: 95
    },
    {
      id: 2,
      test_name: 'JavaScript Essentials Test',
      skill: { name: 'JavaScript', category: 'programming' },
      description: 'Essential JavaScript concepts and syntax',
      difficulty: 'Intermediate',
      time_limit: 15,
      question_count: 20,
      total_score: 100,
      is_recommended: true,
      skill_demand: 88
    },
    {
      id: 3,
      test_name: 'React Components Test',
      skill: { name: 'React', category: 'frontend' },
      description: 'React components, hooks, and lifecycle',
      difficulty: 'Intermediate',
      time_limit: 15,
      question_count: 20,
      total_score: 100,
      is_recommended: true,
      skill_demand: 92
    },
    {
      id: 4,
      test_name: 'Django Framework Test',
      skill: { name: 'Django', category: 'backend' },
      description: 'Django web framework fundamentals',
      difficulty: 'Advanced',
      time_limit: 15,
      question_count: 20,
      total_score: 100,
      is_recommended: false,
      skill_demand: 75
    },
    {
      id: 5,
      test_name: 'SQL Database Test',
      skill: { name: 'SQL', category: 'database' },
      description: 'Database queries and management',
      difficulty: 'Intermediate',
      time_limit: 15,
      question_count: 20,
      total_score: 100,
      is_recommended: true,
      skill_demand: 85
    },
    {
      id: 6,
      test_name: 'SQLite Database Test',
      skill: { name: 'SQLite', category: 'database' },
      description: 'SQLite database management and queries',
      difficulty: 'Beginner',
      time_limit: 15,
      question_count: 20,
      total_score: 100,
      is_recommended: true,
      skill_demand: 80
    },
    {
      id: 7,
      test_name: 'Java Fundamentals Test',
      skill: { name: 'Java', category: 'programming' },
      description: 'Core Java programming concepts',
      difficulty: 'Intermediate',
      time_limit: 15,
      question_count: 20,
      total_score: 100,
      is_recommended: true,
      skill_demand: 85
    },
    {
      id: 8,
      test_name: 'Git Version Control Test',
      skill: { name: 'Git', category: 'devops' },
      description: 'Version control and collaboration',
      difficulty: 'Beginner',
      time_limit: 15,
      question_count: 20,
      total_score: 100,
      is_recommended: false,
      skill_demand: 70
    }
  ];

  const skillIcons = {
    programming: CodeBracketIcon,
    frontend: GlobeAltIcon,
    backend: CpuChipIcon,
    database: CircleStackIcon,
    devops: CommandLineIcon,
    ai: AcademicCapIcon,
    other: BookOpenIcon
  };

  const difficultyColors = {
    'Beginner': 'bg-green-100 text-green-800 border-green-200',
    'Intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Advanced': 'bg-red-100 text-red-800 border-red-200'
  };

  // Détecter les changements d'utilisateur
  useEffect(() => {
    if (userId !== lastUserId) {
      console.log('🔄 User changed, reloading data...', { from: lastUserId, to: userId });
      setLastUserId(userId);
      setUserSkills([]);
      setAllTests([]);
      setRecommendedTests([]);
      setUserProfile(null);
      loadUserSkillsAndTests();
    }
  }, [userId, lastUserId]);

  // Charger les données initiales
  useEffect(() => {
    console.log('🔄 Initial useEffect triggered, userId:', userId, 'allTests length:', allTests.length, 'testsLoaded:', testsLoaded);

    // Si on a déjà des tests, ne pas les recharger
    if (testsLoaded && allTests.length > 0) {
      console.log('✅ Tests already loaded, skipping reload');
      console.log('🔍 Current allTests:', allTests.map(t => t.test_name));
      return;
    }

    if (userId) {
      loadUserSkillsAndTests();
    } else {
      // Si pas d'userId, utiliser un fallback immédiat
      console.log('⚠️ No userId, using immediate fallback data');
      const fallbackSkills = getFallbackSkillsForUser(1);
      const emergencyTests = [...mockTests, ...createPersonalizedTests(fallbackSkills, mockTests)];

      console.log('🚨 Setting emergency tests:', emergencyTests.length);
      setUserSkills(fallbackSkills);
      setAllTests(emergencyTests);
      setTestsLoaded(true);
      setRecommendedTests(emergencyTests.filter(test => test.is_recommended));
      setMySkillsTests(getUniqueMySkillsTests(emergencyTests, fallbackSkills));
      setStats({
        totalTests: emergencyTests.length,
        recommendedCount: emergencyTests.filter(test => test.is_recommended).length,
        completedCount: 0,
        averageScore: 0
      });
      console.log('🔍 Setting loading to false in useEffect');
      setLoading(false);
    }
  }, [userId, testsLoaded]);

  // Écouter les changements de compétences (si l'utilisateur les met à jour)
  useEffect(() => {
    const handleSkillsUpdate = (event) => {
      console.log('🔄 Skills updated, reloading user data...', event.detail);
      // Reset all states to force complete reload
      setTestsLoaded(false);
      setAllTests([]);
      setRecommendedTests([]);
      setMySkillsTests([]);
      setUserSkills([]);
      setUserProfile(null);
      // Force reload after a short delay to ensure state is reset
      setTimeout(() => {
        loadUserSkillsAndTests();
      }, 100);
    };

    // Écouter les événements personnalisés pour les mises à jour de compétences
    window.addEventListener('skillsUpdated', handleSkillsUpdate);
    window.addEventListener('profileUpdated', handleSkillsUpdate);

    return () => {
      window.removeEventListener('skillsUpdated', handleSkillsUpdate);
      window.removeEventListener('profileUpdated', handleSkillsUpdate);
    };
  }, [userId]);

  const loadUserSkillsAndTests = async () => {
    try {
      console.log('🔄 Starting loadUserSkillsAndTests for user ID:', userId);
      setLoading(true);
      console.log('🔄 Loading data for user ID:', userId, 'current allTests:', allTests.length);

      // Clean up duplicate profiles in localStorage first
      const cleanedProfile = cleanupLocalStorageProfiles();

      // Use the same skills fallback logic as job recommendations
      let userProfileData = await getUserProfileWithFallback(null, userId, null);
      let userSkillsData = await getUserSkillsWithFallback(userProfileData, null, userId, null);

      // If we found a cleaned profile with more skills, use it instead
      if (cleanedProfile) {
        const cleanedSkills = cleanedProfile.skillsWithProficiency?.length || cleanedProfile.skills?.length || 0;
        const currentSkills = userSkillsData.length;

        if (cleanedSkills > currentSkills) {
          userProfileData = cleanedProfile;
          userSkillsData = await getUserSkillsWithFallback(cleanedProfile, null, userId, null);
        }
      }


      setUserProfile(userProfileData);

      // Load technical tests from mock data
      const technicalTests = getAllTechnicalTests();
      console.log('🔍 Loaded technical tests:', technicalTests.length, technicalTests.map(t => t.test_name));

      let testsData = technicalTests.map(test => ({
        ...test,
        is_recommended: isRecommendedSkill(test.skill.name, userSkillsData),
        skill_demand: getSkillDemand(test.skill.name)
      }));

      console.log('🔍 Mapped tests data:', testsData.length, testsData.map(t => t.test_name));

      // Ajouter des tests personnalisés pour les compétences de l'utilisateur
      // seulement si aucun test n'existe déjà pour cette compétence
      try {
        const personalizedTests = createPersonalizedTests(userSkillsData, testsData);
        testsData = [...testsData, ...personalizedTests];
      } catch (error) {
        console.error('⚠️ Error creating personalized tests:', error);
        // Continue without personalized tests
      }

      setUserSkills(userSkillsData);

      // Initialize variables for logging
      let recommended = [];
      let mySkills = [];

      // Vérifier que les tests ne sont pas vides avant de les définir
      if (testsData.length > 0) {
        console.log('✅ Setting allTests with', testsData.length, 'tests');
        setAllTests(testsData);
        setTestsLoaded(true);
        console.log('✅ Tests set, should trigger re-render');

        // Separate recommended tests
        recommended = testsData.filter(test => test.is_recommended);
        console.log('🔍 Recommended tests:', recommended.length, recommended.map(t => t.test_name));
        setRecommendedTests(recommended);

        // Filter tests for user's existing skills (unique, one per skill)
        try {
          mySkills = getUniqueMySkillsTests(testsData, userSkillsData);
          setMySkillsTests(mySkills);
        } catch (error) {
          console.error('⚠️ Error filtering my skills tests:', error);
          setMySkillsTests([]);
        }

        // Load test statistics
        const stats = getUserTestStats(userId);
        setTestStats(stats);

        // Calculate completed tests count
        const completedTestsCount = testsData.filter(test => isTestCompleted(test.id)).length;

        // Calculate stats
        setStats({
          totalTests: testsData.length,
          recommendedCount: recommended.length,
          completedCount: completedTestsCount,
          averageScore: stats.averageScore
        });
      }

    } catch (error) {
      console.error('❌ Critical error, using emergency fallback:', error);
      // Emergency fallback - toujours afficher quelque chose
      const fallbackSkills = getFallbackSkillsForUser(userId);
      const emergencyTests = [...mockTests, ...createPersonalizedTests(fallbackSkills, mockTests)];

      setUserSkills(fallbackSkills);
      setAllTests(emergencyTests);
      setTestsLoaded(true);
      setRecommendedTests(emergencyTests.filter(test => test.is_recommended));
      setMySkillsTests(getUniqueMySkillsTests(emergencyTests, fallbackSkills));
      setStats({
        totalTests: emergencyTests.length,
        recommendedCount: emergencyTests.filter(test => test.is_recommended).length,
        completedCount: 0,
        averageScore: 0
      });
    } finally {
      console.log('🔍 Setting loading to false in loadUserSkillsAndTests');
      setLoading(false);
    }
  };

  // Helper functions for better data processing
  const createPersonalizedTests = (userSkills, existingTests = []) => {
    const personalizedTests = [];

    // Normaliser les compétences utilisateur pour gérer différents formats
    let skillIdCounter = 1;
    const normalizedSkills = userSkills.map(skill => {
      if (typeof skill === 'string') {
        return { name: skill, category: 'other', id: skillIdCounter++ };
      }
      if (typeof skill === 'object' && skill.name) {
        return { name: skill.name, category: skill.category || 'other', id: skill.id || skillIdCounter++ };
      }
      return { name: String(skill), category: 'other', id: skillIdCounter++ };
    });

    // Ajouter des tests spécifiques pour les compétences de l'utilisateur
    // seulement si aucun test n'existe déjà pour cette compétence
    normalizedSkills.forEach(skill => {
      const skillName = skill.name.toLowerCase();

      // Vérifier si un test existe déjà pour cette compétence
      const existingTest = existingTests.find(test =>
        test.skill && test.skill.name &&
        test.skill.name.toLowerCase() === skillName
      );

      // Créer un test personnalisé seulement si aucun test n'existe
      if (!existingTest) {
        const customTest = {
          id: Math.floor(1000 + skill.id), // ID unique pour les tests personnalisés (ensure integer)
          test_name: `${skill.name} Assessment Test`,
          skill: { name: skill.name, category: skill.category },
          description: `Test your knowledge of ${skill.name} - personalized for your profile`,
          difficulty: 'Intermediate',
          time_limit: 15,
          question_count: 20,
          total_score: 100,
          is_recommended: true,
          skill_demand: getSkillDemand(skill.name)
        };
        personalizedTests.push(customTest);
      }
    });

    return personalizedTests;
  };

  const getFallbackSkillsForUser = (userId) => {
    // Créer des compétences de fallback différentes pour chaque utilisateur
    const skillSets = [
      [
        { id: 1, name: 'Python', category: 'programming' },
        { id: 2, name: 'Django', category: 'backend' },
        { id: 3, name: 'SQL', category: 'database' }
      ],
      [
        { id: 4, name: 'JavaScript', category: 'programming' },
        { id: 5, name: 'React', category: 'frontend' },
        { id: 6, name: 'Node.js', category: 'backend' }
      ],
      [
        { id: 7, name: 'Java', category: 'programming' },
        { id: 8, name: 'Spring', category: 'backend' },
        { id: 9, name: 'MySQL', category: 'database' }
      ],
      [
        { id: 10, name: 'C#', category: 'programming' },
        { id: 11, name: '.NET', category: 'backend' },
        { id: 12, name: 'Azure', category: 'cloud' }
      ]
    ];

    // Utiliser l'ID utilisateur pour sélectionner un ensemble de compétences
    const skillSetIndex = (userId - 1) % skillSets.length;
    return skillSets[skillSetIndex];
  };

  const getDifficultyFromTime = (timeLimit) => {
    if (timeLimit <= 15) return 'Beginner';
    if (timeLimit <= 20) return 'Intermediate';
    return 'Advanced';
  };

  const isRecommendedSkill = (skillName, userSkills = []) => {
    // Normaliser les compétences utilisateur pour gérer les deux formats (string et object)
    const normalizedUserSkills = userSkills.map(skill => {
      if (typeof skill === 'string') {
        return skill.toLowerCase();
      }
      if (typeof skill === 'object' && skill.name) {
        return skill.name.toLowerCase();
      }
      return String(skill).toLowerCase();
    });

    // Vérifier si l'utilisateur a déjà cette compétence
    const hasSkill = normalizedUserSkills.includes(skillName.toLowerCase());

    // Compétences recommandées basées sur la demande du marché
    const highDemandSkills = ['Python', 'JavaScript', 'React', 'SQL', 'Django', 'Node.js'];
    const isHighDemand = highDemandSkills.includes(skillName);

    // Recommander si c'est une compétence en forte demande ET que l'utilisateur ne l'a pas encore
    return isHighDemand && !hasSkill;
  };

  const getSkillDemand = (skillName) => {
    const demandScores = {
      'Python': 95,
      'JavaScript': 88,
      'React': 92,
      'Django': 75,
      'SQL': 85,
      'Git': 70,
      'Node.js': 80,
      'Java': 85,
      'Spring': 75,
      'C#': 80,
      '.NET': 75,
      'Azure': 90
    };
    return demandScores[skillName] || 70;
  };

  // Filter tests based on user's existing skills
  const getMySkillsTests = (tests, userSkills) => {
    if (!userSkills || userSkills.length === 0) return [];

    // Normaliser les compétences utilisateur
    const userSkillNames = userSkills.map(skill => {
      if (typeof skill === 'string') return skill.toLowerCase();
      if (typeof skill === 'object' && skill.name) return skill.name.toLowerCase();
      return String(skill).toLowerCase();
    });

    return tests.filter(test => {
      if (!test || !test.skill || !test.skill.name) return false;

      const testSkillName = test.skill.name.toLowerCase();

      // Check if the test skill matches any of the user's skills
      return userSkillNames.some(userSkill =>
        userSkill === testSkillName ||
        testSkillName.includes(userSkill) ||
        userSkill.includes(testSkillName)
      );
    });
  };

  // Filter tests to show only one test per user skill (avoid duplicates)
  const getUniqueMySkillsTests = (tests, userSkills) => {
    if (!userSkills || userSkills.length === 0) {
      return [];
    }

    // Normaliser les compétences utilisateur
    const userSkillNames = userSkills.map(skill => {
      if (typeof skill === 'string') return skill.toLowerCase();
      if (typeof skill === 'object' && skill.name) return skill.name.toLowerCase();
      return String(skill).toLowerCase();
    });

    const uniqueTests = [];
    const usedSkills = new Set();

    // First, try to find exact matches for each user skill
    userSkillNames.forEach(userSkill => {
      const exactMatch = tests.find(test => {
        if (!test || !test.skill || !test.skill.name) return false;
        const testSkillName = test.skill.name.toLowerCase();
        return testSkillName === userSkill && !usedSkills.has(userSkill);
      });

      if (exactMatch) {
        uniqueTests.push(exactMatch);
        usedSkills.add(userSkill);
      }
    });

    // If no exact matches found, try partial matches
    if (uniqueTests.length === 0) {
      userSkillNames.forEach(userSkill => {
        const partialMatch = tests.find(test => {
          if (!test || !test.skill || !test.skill.name) return false;
          const testSkillName = test.skill.name.toLowerCase();
          return (testSkillName.includes(userSkill) || userSkill.includes(testSkillName)) && !usedSkills.has(userSkill);
        });

        if (partialMatch) {
          uniqueTests.push(partialMatch);
          usedSkills.add(userSkill);
        }
      });
    }

    return uniqueTests;
  };

  // Temporarily disable filtering to debug
  const filteredTests = allTests; // .filter(test => {
  // if (!test || !test.test_name || !test.skill) {
  //   console.log('❌ Test filtered out - missing properties:', test);
  //   return false;
  // }

  // const matchesSearch = test.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   test.skill.name.toLowerCase().includes(searchTerm.toLowerCase());
  // const matchesDifficulty = selectedDifficulty === 'all' || test.difficulty === selectedDifficulty;
  // const matchesSkill = selectedSkill === 'all' || test.skill.name === selectedSkill;

  // const matches = matchesSearch && matchesDifficulty && matchesSkill;

  // if (!matches) {
  //   console.log('❌ Test filtered out:', test.test_name, {
  //     matchesSearch,
  //     matchesDifficulty,
  //     matchesSkill,
  //     searchTerm,
  //     selectedDifficulty,
  //     selectedSkill
  //   });
  // }

  // return matches;
  // });

  console.log('🔍 Filtering debug:', {
    allTestsLength: allTests.length,
    filteredTestsLength: filteredTests.length,
    searchTerm,
    selectedDifficulty,
    selectedSkill
  });


  const getSkillIcon = (category) => {
    const IconComponent = skillIcons[category] || BookOpenIcon;
    return <IconComponent className="w-5 h-5" />;
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const TestCard = ({ test, isRecommended = false, isMySkill = false }) => {
    const IconComponent = skillIcons[test.skill.category] || BookOpenIcon;
    const completionInfo = getTestCompletionInfo(test.id);
    const isCompleted = isTestCompleted(test.id);

    return (
      <div className={`group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:-translate-y-2 shadow-sm ${isCompleted ? 'opacity-90' : ''}`}>
        {isCompleted && completionInfo && (
          <div className={`absolute -top-2 -right-2 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg ${completionInfo.passed
            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
            : 'bg-gradient-to-r from-orange-500 to-red-600'
            }`}>
            {completionInfo.passed ? (
              <CheckCircleSolidIcon className="w-3 h-3" />
            ) : (
              <XCircleIcon className="w-3 h-3" />
            )}
            {completionInfo.passed ? 'Réussi' : 'Terminé'}
          </div>
        )}
        {isMySkill && !isCompleted && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
            <CheckCircleSolidIcon className="w-3 h-3" />
            Ma Compétence
          </div>
        )}
        {isRecommended && !isMySkill && !isCompleted && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
            <FireIcon className="w-3 h-3" />
            Recommandé
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${isMySkill ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
              <IconComponent className={`w-6 h-6 ${isMySkill ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-300'}`} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {test.test_name}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                {test.skill.name} • {test.skill.category}
              </p>
            </div>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
          {test.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[test.difficulty]}`}>
            {test.difficulty}
          </span>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-xs font-medium">
            {test.question_count} questions
          </span>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-xs font-medium">
            {formatTime(test.time_limit)}
          </span>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-xs font-medium">
            {test.total_score} points
          </span>
        </div>

        {isCompleted && completionInfo && (
          <div className={`mb-4 p-3 rounded-lg border ${completionInfo.passed
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
            : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
            }`}>
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 text-sm ${completionInfo.passed
                ? 'text-green-700 dark:text-green-300'
                : 'text-orange-700 dark:text-orange-300'
                }`}>
                {completionInfo.passed ? (
                  <CheckCircleSolidIcon className="w-4 h-4" />
                ) : (
                  <XCircleIcon className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {completionInfo.passed ? 'Test terminé avec succès!' : 'Test terminé'}
                </span>
              </div>
              <div className={`text-sm font-semibold ${completionInfo.passed
                ? 'text-green-600 dark:text-green-400'
                : 'text-orange-600 dark:text-orange-400'
                }`}>
                {completionInfo.percentage}%
              </div>
            </div>
            <div className={`mt-2 text-xs ${completionInfo.passed
              ? 'text-green-600 dark:text-green-400'
              : 'text-orange-600 dark:text-orange-400'
              }`}>
              Terminé le {new Date(completionInfo.completedAt).toLocaleDateString('fr-FR')} •
              Temps: {Math.floor(completionInfo.timeSpent / 60)}:{(completionInfo.timeSpent % 60).toString().padStart(2, '0')}
            </div>
          </div>
        )}
        {isMySkill && !isCompleted && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
              <CheckCircleSolidIcon className="w-4 h-4" />
              <span className="font-medium">Compétence détectée dans votre profil</span>
            </div>
          </div>
        )}
        {isRecommended && !isMySkill && !isCompleted && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <ChartBarIcon className="w-4 h-4" />
              <span className="font-medium">Compétence en forte demande ({test.skill_demand}% match emploi)</span>
            </div>
          </div>
        )}

        {isCompleted ? (
          <div className="space-y-2">
            <div className={`w-full px-4 py-3 rounded-lg font-semibold border flex items-center justify-center gap-2 ${completionInfo.passed
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700'
              : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700'
              }`}>
              {completionInfo.passed ? (
                <CheckCircleSolidIcon className="w-4 h-4" />
              ) : (
                <XCircleIcon className="w-4 h-4" />
              )}
              {completionInfo.passed ? 'Test réussi' : 'Test terminé'}
            </div>
            <button
              onClick={() => retakeTest(test.id)}
              className="w-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Repasser le test
            </button>
          </div>
        ) : (
          <button
            onClick={() => startTechnicalTest(test.id)}
            className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 group/btn ${isMySkill
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white shadow-md hover:shadow-lg'
              }`}
          >
            <PlayIcon className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            Commencer le test
          </button>
        )}
      </div>
    );
  };

  console.log('🔍 Component render - loading:', loading, 'allTests.length:', allTests.length, 'testsLoaded:', testsLoaded);
  console.log('🔍 Current allTests:', allTests.map(t => t.test_name));

  if (loading) {
    console.log('🔍 Showing loading screen');
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show test runner if a test is selected
  if (showTestRunner && currentTest) {
    return (
      <TechnicalTestRunner
        testId={currentTest.id}
        userId={userId}
        onTestComplete={handleTestComplete}
        onBack={handleBackFromTest}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Tests de Compétences
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Évaluez et développez vos compétences techniques
              </p>
              {userProfile && (
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Connecté en tant que <strong>{userProfile.name}</strong></span>
                  {userSkills.length > 0 && (
                    <span>• {userSkills.length} compétence{userSkills.length > 1 ? 's' : ''} détectée{userSkills.length > 1 ? 's' : ''}</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Simulate skills update event
                  window.dispatchEvent(new CustomEvent('skillsUpdated', {
                    detail: { userId, skills: userSkills }
                  }));
                }}
                className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
              >
                Actualiser
              </button>
              <button
                onClick={onBackToDashboard}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Retour au tableau de bord
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl">
                <BookOpenIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stats.totalTests}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Tests disponibles</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 rounded-2xl">
                <AcademicCapIcon className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{mySkillsTests.length}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Mes Compétences</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-2xl">
                <SparklesIcon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stats.recommendedCount}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Recommandés</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 rounded-2xl">
                <CheckCircleSolidIcon className="w-7 h-7 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stats.completedCount}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Terminés</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 rounded-2xl">
                <TrophyIcon className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stats.averageScore}%</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Score moyen</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Skills Section */}
        {userSkills.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700 mb-8 shadow-sm">
            <div className="flex items-center gap-4 mb-5">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl">
                <AcademicCapIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Vos Compétences Détectées
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Tests personnalisés basés sur vos compétences actuelles
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {userSkills.map(skill => (
                <span
                  key={skill.id || skill}
                  className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-semibold border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  {skill.name || skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl">
              <MagnifyingGlassIcon className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Rechercher et Filtrer
            </h3>
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un test ou une compétence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">Toutes les difficultés</option>
                <option value="Beginner">Débutant</option>
                <option value="Intermediate">Intermédiaire</option>
                <option value="Advanced">Avancé</option>
              </select>

              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">Toutes les compétences</option>
                {[...new Set(allTests.map(test => test.skill.name))].map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* My Skills Tests Section */}
        {mySkillsTests.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Mes Tests de Compétences
              </h2>
              <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                {mySkillsTests.length} test{mySkillsTests.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mySkillsTests
                .filter(test => {
                  const matchesSearch = test.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    test.skill.name.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesDifficulty = selectedDifficulty === 'all' || test.difficulty === selectedDifficulty;
                  const matchesSkill = selectedSkill === 'all' || test.skill.name === selectedSkill;
                  return matchesSearch && matchesDifficulty && matchesSkill;
                })
                .map(test => (
                  <TestCard key={test.id} test={test} isMySkill={true} />
                ))}
            </div>
          </div>
        )}

        {/* Recommended Tests Section */}
        {recommendedTests.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Tests Recommandés
              </h2>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                {recommendedTests.length} tests
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedTests
                .filter(test => {
                  const matchesSearch = test.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    test.skill.name.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesDifficulty = selectedDifficulty === 'all' || test.difficulty === selectedDifficulty;
                  const matchesSkill = selectedSkill === 'all' || test.skill.name === selectedSkill;
                  return matchesSearch && matchesDifficulty && matchesSkill;
                })
                .map(test => (
                  <TestCard key={test.id} test={test} isRecommended={true} />
                ))}
            </div>
          </div>
        )}

        {/* All Tests Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <BookOpenIcon className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Tous les Tests
            </h2>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium">
              {filteredTests.length} tests
            </span>
          </div>

          {filteredTests.length === 0 ? (
            <div className="text-center py-12">
              <BookOpenIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Aucun test trouvé
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Essayez de modifier vos critères de recherche
              </p>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <p>Tests disponibles: {allTests.length}</p>
                <p>Critères: {searchTerm ? `"${searchTerm}"` : 'Aucun'} | {selectedDifficulty} | {selectedSkill}</p>
              </div>
              {/* Afficher tous les tests si le filtrage échoue */}
              {allTests.length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedDifficulty('all');
                      setSelectedSkill('all');
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Afficher tous les tests
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {console.log('🔍 Rendering tests section - filteredTests.length:', filteredTests.length)}
              {filteredTests.length > 0 ? (
                filteredTests.map(test => {
                  console.log('🔍 Rendering test:', test.test_name);
                  return <TestCard key={test.id} test={test} />;
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-slate-500 dark:text-slate-400">
                    <BookOpenIcon className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg font-medium">Aucun test trouvé</p>
                    <p className="text-sm">Essayez de modifier vos filtres de recherche</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Test Runner Modal */}
      {showTestRunner && currentTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <TechnicalTestRunner
              test={currentTest}
              onComplete={handleTestComplete}
              onBack={handleBackFromTest}
            />
          </div>
        </div>
      )}

      {/* Scores Page */}
      {showScoresPage && (
        <TestScoresPage
          userId={userId}
          onBack={() => setShowScoresPage(false)}
        />
      )}
    </div>
  );
};

export default SkillTestsOverview;
