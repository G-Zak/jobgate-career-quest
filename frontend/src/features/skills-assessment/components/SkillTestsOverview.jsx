import React, { useState, useEffect } from 'react';
import {
  BookOpenIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
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
  FireIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const SkillTestsOverview = ({ onBackToDashboard, onStartTest, userId = 1 }) => {
  const [userSkills, setUserSkills] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [recommendedTests, setRecommendedTests] = useState([]);
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

  // Debug: Log state changes
  useEffect(() => {
    console.log('🔍 allTests state changed:', allTests.length, allTests);
  }, [allTests]);

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
    console.log('🔄 Initial useEffect triggered, userId:', userId, 'allTests length:', allTests.length);

    // Si on a déjà des tests, ne pas les recharger
    if (testsLoaded && allTests.length > 0) {
      console.log('✅ Tests already loaded, skipping reload');
      return;
    }

    if (userId) {
      loadUserSkillsAndTests();
    } else {
      // Si pas d'userId, utiliser un fallback immédiat
      console.log('⚠️ No userId, using immediate fallback data');
      const fallbackSkills = getFallbackSkillsForUser(1);
      const emergencyTests = [...mockTests, ...createPersonalizedTests(fallbackSkills)];

      console.log('🚨 Setting emergency tests:', emergencyTests.length);
      setUserSkills(fallbackSkills);
      setAllTests(emergencyTests);
      setTestsLoaded(true);
      setRecommendedTests(emergencyTests.filter(test => test.is_recommended));
      setStats({
        totalTests: emergencyTests.length,
        recommendedCount: emergencyTests.filter(test => test.is_recommended).length,
        completedCount: 0,
        averageScore: 0
      });
      setLoading(false);
    }
  }, [userId]);

  // Écouter les changements de compétences (si l'utilisateur les met à jour)
  useEffect(() => {
    const handleSkillsUpdate = () => {
      console.log('🔄 Skills updated, reloading user data...');
      loadUserSkillsAndTests();
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
      setLoading(true);
      console.log('🔄 Loading data for user ID:', userId, 'current allTests:', allTests.length);

      // Load user profile and skills
      let userSkillsData = [];
      let userProfileData = null;

      try {
        const candidateResponse = await fetch(`http://localhost:8000/api/candidates/${userId}/`);
        if (candidateResponse.ok) {
          const candidate = await candidateResponse.json();
          userProfileData = candidate;
          userSkillsData = candidate.skills || [];
          console.log('✅ User profile loaded:', {
            id: candidate.id,
            name: candidate.name || 'Unknown',
            skills: userSkillsData.length
          });
        } else {
          console.log('⚠️ User profile not found, using fallback');
          userProfileData = {
            id: userId,
            name: `User ${userId}`,
            skills: []
          };
          userSkillsData = getFallbackSkillsForUser(userId);
        }
      } catch (error) {
        console.log('⚠️ Error loading user profile, using fallback:', error);
        userProfileData = {
          id: userId,
          name: `User ${userId}`,
          skills: []
        };
        userSkillsData = getFallbackSkillsForUser(userId);
      }

      setUserProfile(userProfileData);

      // Load skill tests - TOUJOURS utiliser les tests mock pour garantir l'affichage
      let testsData = [];

      // Essayer l'API d'abord
      try {
        const testsResponse = await fetch('http://localhost:8000/api/skills/tests/');
        if (testsResponse.ok) {
          const response = await testsResponse.json();
          if (response.success && response.data) {
            console.log('✅ API tests loaded, transforming...');

            testsData = Object.values(response.data).flatMap(skillData =>
              skillData.tests.map(test => ({
                ...test,
                skill: skillData.skill,
                difficulty: getDifficultyFromTime(test.time_limit),
                is_recommended: isRecommendedSkill(skillData.skill.name, userSkillsData),
                skill_demand: getSkillDemand(skillData.skill.name)
              }))
            );
            console.log('✅ API tests transformed:', testsData.length, 'tests');
          }
        }
      } catch (error) {
        console.log('⚠️ API failed, using mock data:', error);
      }

      // Si l'API n'a pas fourni de tests, utiliser les tests mock
      if (testsData.length === 0) {
        console.log('🔄 No API tests, using mock data');
        testsData = [...mockTests];
      }

      // Ajouter des tests personnalisés pour les compétences de l'utilisateur
      const personalizedTests = createPersonalizedTests(userSkillsData);
      testsData = [...testsData, ...personalizedTests];

      console.log('✅ Final tests data:', testsData.length, 'tests');

      setUserSkills(userSkillsData);

      // Vérifier que les tests ne sont pas vides avant de les définir
      if (testsData.length > 0) {
        console.log('✅ Setting tests data:', testsData.length, 'tests');
        setAllTests(testsData);
        setTestsLoaded(true);

        // Separate recommended tests
        const recommended = testsData.filter(test => test.is_recommended);
        setRecommendedTests(recommended);

        // Calculate stats
        setStats({
          totalTests: testsData.length,
          recommendedCount: recommended.length,
          completedCount: 0,
          averageScore: 0
        });
      } else {
        console.log('⚠️ No tests to set, keeping existing data');
      }

      console.log('✅ Data loaded successfully:', {
        userId: userId,
        userProfile: userProfileData?.name || 'Unknown',
        userSkills: userSkillsData.length,
        allTests: testsData.length,
        recommended: recommended.length
      });

    } catch (error) {
      console.error('❌ Critical error, using emergency fallback:', error);
      // Emergency fallback - toujours afficher quelque chose
      const fallbackSkills = getFallbackSkillsForUser(userId);
      const emergencyTests = [...mockTests, ...createPersonalizedTests(fallbackSkills)];

      console.log('🚨 Emergency fallback activated:', emergencyTests.length, 'tests');

      setUserSkills(fallbackSkills);
      setAllTests(emergencyTests);
      setTestsLoaded(true);
      setRecommendedTests(emergencyTests.filter(test => test.is_recommended));
      setStats({
        totalTests: emergencyTests.length,
        recommendedCount: emergencyTests.filter(test => test.is_recommended).length,
        completedCount: 0,
        averageScore: 0
      });

      console.log('🚨 Emergency tests set:', emergencyTests.length, 'tests');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for better data processing
  const createPersonalizedTests = (userSkills) => {
    const personalizedTests = [];

    // Ajouter des tests spécifiques pour les compétences de l'utilisateur
    userSkills.forEach(skill => {
      const skillName = skill.name.toLowerCase();

      // Créer un test personnalisé pour cette compétence
      const customTest = {
        id: 1000 + skill.id, // ID unique pour les tests personnalisés
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
      console.log('✅ Created personalized test for skill:', skill.name);
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
    // Vérifier si l'utilisateur a déjà cette compétence
    const hasSkill = userSkills.some(skill =>
      skill.name.toLowerCase() === skillName.toLowerCase()
    );

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

  const filteredTests = allTests.filter(test => {
    if (!test || !test.test_name || !test.skill) {
      console.log('⚠️ Invalid test data:', test);
      return false;
    }

    const matchesSearch = test.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || test.difficulty === selectedDifficulty;
    const matchesSkill = selectedSkill === 'all' || test.skill.name === selectedSkill;

    const matches = matchesSearch && matchesDifficulty && matchesSkill;
    return matches;
  });

  console.log('🔍 Filtering results:', {
    allTests: allTests.length,
    filteredTests: filteredTests.length,
    searchTerm,
    selectedDifficulty,
    selectedSkill
  });

  // Debug: Log filteredTests changes
  useEffect(() => {
    console.log('🔍 filteredTests calculated:', filteredTests.length, filteredTests);
  }, [filteredTests]);

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

  const TestCard = ({ test, isRecommended = false }) => {
    const IconComponent = skillIcons[test.skill.category] || BookOpenIcon;

    return (
      <div className={`group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:-translate-y-1`}>
        {isRecommended && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <FireIcon className="w-3 h-3" />
            Recommended
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <IconComponent className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {test.test_name}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {test.skill.name} • {test.skill.category}
              </p>
            </div>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
          {test.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${difficultyColors[test.difficulty]}`}>
            {test.difficulty}
          </span>
          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-xs font-medium">
            {test.question_count} questions
          </span>
          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-xs font-medium">
            {formatTime(test.time_limit)}
          </span>
          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-xs font-medium">
            {test.total_score} points
          </span>
        </div>

        {isRecommended && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <ChartBarIcon className="w-4 h-4" />
              <span>High demand skill ({test.skill_demand}% job match)</span>
            </div>
          </div>
        )}

        <button
          onClick={() => onStartTest && onStartTest(test.id, test.skill.id)}
          className="w-full bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 group/btn"
        >
          <PlayIcon className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          Commencer le test
        </button>
      </div>
    );
  };

  if (loading) {
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
              {/* Debug info */}
              <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                Debug: Tests={allTests.length} | Filtered={filteredTests.length} | UserId={userId}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  console.log('🔍 Debug data:', {
                    allTests: allTests.length,
                    filteredTests: filteredTests.length,
                    userSkills: userSkills.length,
                    userId: userId,
                    searchTerm,
                    selectedDifficulty,
                    selectedSkill
                  });
                  loadUserSkillsAndTests();
                }}
                className="px-3 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors text-sm"
              >
                Debug
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BookOpenIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalTests}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Tests disponibles</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.recommendedCount}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Recommandés</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircleSolidIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completedCount}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Terminés</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <TrophyIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.averageScore}%</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Score moyen</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Skills Section */}
        {userSkills.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <AcademicCapIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Vos Compétences
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {userSkills.map(skill => (
                <span
                  key={skill.id}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un test ou une compétence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toutes les difficultés</option>
                <option value="Beginner">Débutant</option>
                <option value="Intermediate">Intermédiaire</option>
                <option value="Advanced">Avancé</option>
              </select>

              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toutes les compétences</option>
                {[...new Set(allTests.map(test => test.skill.name))].map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

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
              {filteredTests.map(test => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillTestsOverview;
