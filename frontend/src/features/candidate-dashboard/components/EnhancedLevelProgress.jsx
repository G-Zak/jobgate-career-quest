import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  StarIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  AcademicCapIcon,
  UserIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import dashboardApi from '../services/dashboardApi';
import xpCalculationService from '../services/xpCalculationService';

const EnhancedLevelProgress = () => {
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showXPBreakdown, setShowXPBreakdown] = useState(false);

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Fetching comprehensive level and XP data...');

        // Fetch all data sources for XP calculation
        const [testStats, employabilityData, achievements, recentTests, userProfile] = await Promise.all([
          dashboardApi.getTestStatistics(),
          dashboardApi.getEmployabilityScore(),
          dashboardApi.getAchievements(),
          dashboardApi.getRecentTests(10),
          dashboardApi.getUserProfile()
        ]);

        console.log('📊 Level data received:', { testStats, employabilityData, achievements, recentTests, userProfile });

        // Prepare comprehensive user data for XP calculation
        const comprehensiveUserData = {
          tests: recentTests.map(test => ({
            test_type: test.test?.test_type || 'general',
            difficulty: test.test?.difficulty || 'medium',
            score: test.score || 0,
            time_spent: test.time_spent || 0,
            questions_count: test.test?.questions_count || 10
          })),
          skills_assessments: [{
            completed: testStats.totalTests > 0,
            score: testStats.averageScore || 0,
            skills_count: userProfile?.skills?.length || 0
          }],
          profile: {
            basic_info_complete: !!(userProfile?.full_name && userProfile?.email),
            skills_count: userProfile?.skills?.length || 0,
            bio_completed: !!userProfile?.bio,
            cv_uploaded: !!userProfile?.cv_placeholder,
            profile_picture: !!userProfile?.profile_picture,
            career_goals: !!userProfile?.career_goals
          },
          engagement: {
            login_streak_days: calculateLoginStreak(userProfile),
            weekly_streak: Math.floor(testStats.totalTests / 7),
            monthly_streak: Math.floor(testStats.totalTests / 30),
            first_test_days: Math.min(testStats.totalTests, 30)
          },
          achievements: achievements || [],
          coding_challenges: [] // TODO: Add when coding challenges are available
        };

        // Calculate comprehensive XP and level data
        const totalXP = xpCalculationService.calculateTotalXP(comprehensiveUserData);
        const levelProgress = xpCalculationService.calculateLevelProgress(totalXP);
        const levelTitle = xpCalculationService.getLevelTitle(levelProgress.currentLevel);

        // Calculate XP breakdown for display
        const xpBreakdown = calculateXPBreakdown(comprehensiveUserData);

        const levelData = {
          ...levelProgress,
          levelTitle,
          xpBreakdown,
          recentXPGains: calculateRecentXPGains(recentTests.slice(0, 5)),
          nextMilestones: getNextMilestones(levelProgress.currentLevel, achievements),
          levelBenefits: getLevelBenefits(levelProgress.currentLevel)
        };

        setLevelData(levelData);
        console.log('✅ Level progress loaded successfully:', levelData);

      } catch (err) {
        console.error('❌ Error fetching level data:', err);
        setError('Failed to load level progress data');
      } finally {
        setLoading(false);
      }
    };

    fetchLevelData();
  }, []);

  const calculateLoginStreak = (userProfile) => {
    // Simplified calculation - in real implementation, this would come from backend
    const lastLogin = userProfile?.last_login ? new Date(userProfile.last_login) : new Date();
    const today = new Date();
    const daysDiff = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));
    return Math.max(0, 7 - daysDiff); // Assume 7-day streak if recent login
  };

  const calculateXPBreakdown = (userData) => {
    return {
      tests: xpCalculationService.calculateTestXP({ test_type: 'general', difficulty: 'medium', score: 75, questions_count: 10 }) * userData.tests.length,
      skills: xpCalculationService.calculateSkillsAssessmentXP(userData.skills_assessments[0] || {}),
      profile: xpCalculationService.calculateProfileCompletionXP(userData.profile),
      engagement: xpCalculationService.calculateEngagementXP(userData.engagement),
      achievements: xpCalculationService.calculateAchievementXP(userData.achievements)
    };
  };

  const calculateRecentXPGains = (recentTests) => {
    return recentTests.map(test => ({
      source: test.test?.name || 'Test',
      xp: xpCalculationService.calculateTestXP({
        test_type: test.test?.test_type || 'general',
        difficulty: test.test?.difficulty || 'medium',
        score: test.score || 0,
        questions_count: test.test?.questions_count || 10
      }),
      date: test.start_time || test.created_at
    }));
  };

  const getNextMilestones = (currentLevel, achievements) => {
    const milestones = [];
    
    // Next level milestone
    milestones.push({
      type: 'level',
      title: `Reach Level ${currentLevel + 1}`,
      description: `Unlock ${xpCalculationService.getLevelTitle(currentLevel + 1)} status`,
      icon: StarIcon,
      color: 'text-yellow-600 bg-yellow-100'
    });

    // Achievement milestones
    const unearnedAchievements = achievements.filter(a => !a.earned).slice(0, 2);
    unearnedAchievements.forEach(achievement => {
      milestones.push({
        type: 'achievement',
        title: achievement.title,
        description: achievement.description,
        icon: TrophyIcon,
        color: 'text-blue-600 bg-blue-100'
      });
    });

    return milestones.slice(0, 3);
  };

  const getLevelBenefits = (level) => {
    const benefits = {
      1: ['Basic dashboard access', 'Test taking capability'],
      2: ['Performance analytics', 'Basic recommendations'],
      3: ['Advanced analytics', 'Skill tracking', 'Achievement system'],
      4: ['Career insights', 'Industry benchmarks', 'Priority support'],
      5: ['Expert analysis', 'Custom recommendations', 'Beta features'],
      6: ['Advanced reporting', 'Mentor matching', 'Exclusive content'],
      7: ['Leadership insights', 'Industry networking', 'Premium features'],
      8: ['Executive dashboard', 'Advanced AI insights', 'VIP support'],
      9: ['Industry expert status', 'Thought leadership platform'],
      10: ['Elite member benefits', 'Exclusive events', 'Personal advisor'],
      11: ['Legendary status', 'Platform ambassador', 'Ultimate benefits']
    };
    
    return benefits[level] || benefits[11];
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-6">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Unable to Load Level Data</h3>
          <p className="text-xs text-gray-600 mb-3">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!levelData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-6">
          <div className="text-gray-400 text-3xl mb-2">⭐</div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">No Level Data</h4>
          <p className="text-xs text-gray-600">Start taking tests to begin your journey</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Level Progress</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowXPBreakdown(!showXPBreakdown)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {showXPBreakdown ? 'Hide' : 'Show'} XP Details
          </button>
          <ChartBarIcon className="h-5 w-5 text-blue-500" />
        </div>
      </div>

      {/* Level Display */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                {i < Math.min(levelData.currentLevel, 5) ? (
                  <StarIconSolid className="h-6 w-6 text-yellow-500" />
                ) : (
                  <StarIcon className="h-6 w-6 text-gray-300" />
                )}
              </div>
            ))}
            {levelData.currentLevel > 5 && (
              <span className="ml-2 text-sm font-bold text-yellow-600">
                +{levelData.currentLevel - 5}
              </span>
            )}
          </div>
        </div>
        <h4 className="text-xl font-bold text-gray-900">Level {levelData.currentLevel}</h4>
        <p className="text-sm text-gray-600">{levelData.levelTitle}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Progress to Level {levelData.currentLevel + 1}</span>
          <span className="text-gray-900 font-medium">{levelData.progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${levelData.progressPercentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{levelData.totalXP.toLocaleString()} XP</span>
          <span>{levelData.nextLevelXP.toLocaleString()} XP</span>
        </div>
      </div>

      {/* XP Breakdown (Collapsible) */}
      {showXPBreakdown && (
        <motion.div
          className="mb-4 p-3 bg-gray-50 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h5 className="text-sm font-medium text-gray-700 mb-2">XP Breakdown</h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Tests:</span>
              <span className="font-medium">{levelData.xpBreakdown.tests} XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Skills:</span>
              <span className="font-medium">{levelData.xpBreakdown.skills} XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Profile:</span>
              <span className="font-medium">{levelData.xpBreakdown.profile} XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Engagement:</span>
              <span className="font-medium">{levelData.xpBreakdown.engagement} XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Achievements:</span>
              <span className="font-medium">{levelData.xpBreakdown.achievements} XP</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent XP Gains */}
      <div className="mb-4">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Recent XP Gains</h5>
        <div className="space-y-1">
          {levelData.recentXPGains.slice(0, 3).map((gain, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <FireIcon className="h-3 w-3 text-orange-500 mr-2" />
                <span className="text-gray-600 truncate">{gain.source}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-green-600">+{gain.xp} XP</span>
                <span className="text-gray-400">
                  {new Date(gain.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Milestones */}
      <div className="mb-4">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Next Milestones</h5>
        <div className="space-y-2">
          {levelData.nextMilestones.map((milestone, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <div className={`p-1 rounded ${milestone.color}`}>
                <milestone.icon className="h-3 w-3" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">{milestone.title}</p>
                <p className="text-xs text-gray-600 truncate">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Level Benefits */}
      <div className="border-t pt-4">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Level {levelData.currentLevel} Benefits</h5>
        <div className="space-y-1">
          {levelData.levelBenefits.map((benefit, index) => (
            <div key={index} className="flex items-center text-xs">
              <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedLevelProgress;
