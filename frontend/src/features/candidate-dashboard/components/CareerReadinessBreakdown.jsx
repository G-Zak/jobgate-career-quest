import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import RadarChart from './RadarChart';
import CareerReadinessModal from './CareerReadinessModal';
import WeakAreasModal from './WeakAreasModal';

import dashboardApi from '../services/dashboardApi';

const CareerReadinessBreakdown = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breakdownData, setBreakdownData] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]); // Individual categories for spider chart
  const [groupedCategoryStats, setGroupedCategoryStats] = useState([]); // Grouped categories for cards
  const [employabilityData, setEmployabilityData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWeakAreasModalOpen, setIsWeakAreasModalOpen] = useState(false);
  const [weakAreasRecommendations, setWeakAreasRecommendations] = useState([]);

  // Fetch comprehensive career readiness data

  useEffect(() => {
    const fetchBreakdownData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Fetching user-specific career readiness data...');

        // Fetch both category stats and employability score data
        const [categoryData, employabilityScore] = await Promise.all([
          dashboardApi.getCareerReadinessBreakdown(),
          dashboardApi.getEmployabilityScore()
        ]);

        console.log('📊 Category data received:', categoryData);
        console.log('📈 Employability score received:', employabilityScore);

        setBreakdownData(categoryData);
        setEmployabilityData(employabilityScore);

        // Transform category data for display - Enhanced for comprehensive cognitive skills
        let transformedCategories = [];

        if (employabilityScore?.categories && Object.keys(employabilityScore.categories).length > 0) {
          console.log('✅ Using employability score categories (user-specific data)');

          // Create comprehensive category mapping including all cognitive dimensions
          const allCognitiveCategories = createComprehensiveCategoryMapping(employabilityScore.categories);

          transformedCategories = allCognitiveCategories.map((category) => ({
            id: category.id,
            name: getCategoryDisplayName(category.id),
            icon: getCategoryIcon(category.id),
            score: Math.round(category.score || 0),
            previousScore: Math.round((category.score || 0) - (category.improvement || 0)),
            benchmark: getBenchmarkForCategory(category.id),
            description: getCategoryDescription(category.id),
            color: getCategoryColor(category.id),
            count: category.count || 0,
            bestScore: Math.round(category.best_score || 0),
            consistency: Math.round(category.consistency || 0),
            lastTaken: category.last_taken,
            hasData: category.hasData
          }));
        } else if (categoryData?.categories && categoryData.categories.length > 0) {
          console.log('✅ Using category breakdown data (user-specific data)');

          // Create comprehensive mapping from category breakdown data
          const allCognitiveCategories = createComprehensiveCategoryMapping(null, categoryData.categories);

          transformedCategories = allCognitiveCategories.map((category) => ({
            id: category.id,
            name: getCategoryDisplayName(category.id),
            icon: getCategoryIcon(category.id),
            score: Math.round(category.score || 0),
            previousScore: Math.round((category.score || 0) - 5), // Estimate improvement
            benchmark: getBenchmarkForCategory(category.id),
            description: getCategoryDescription(category.id),
            color: getCategoryColor(category.id),
            count: category.count || 0,
            bestScore: Math.round(category.best_score || 0),
            consistency: category.consistency || 0,
            lastTaken: category.last_taken,
            hasData: category.hasData
          }));
        } else {
          console.log('⚠️ No user-specific data found - showing comprehensive category structure');
          // Show all cognitive categories with zero scores to maintain spider chart structure
          transformedCategories = createDefaultCognitiveCategories();
        }

        setCategoryStats(transformedCategories);

        // Create grouped categories for cards display
        const groupedCategories = createGroupedCategoriesForCards(transformedCategories);
        setGroupedCategoryStats(groupedCategories);

        console.log('📋 Final individual categories (spider chart):', transformedCategories);
        console.log('📋 Final grouped categories (cards):', groupedCategories);

      } catch (err) {
        console.error('❌ Error fetching career readiness breakdown:', err);
        setError('Failed to load career readiness data. Please try again.');
        // Don't fall back to mock data - show error state instead
        setCategoryStats([]);
        setGroupedCategoryStats([]);

      } finally {
        setLoading(false);
      }
    };

    fetchBreakdownData();
  }, []);

  // Function to analyze weak areas and generate test recommendations
  const analyzeWeakAreas = () => {
    if (!categoryStats || categoryStats.length === 0) {
      setWeakAreasRecommendations([]);
      return;
    }

    // Find individual test categories with scores below 70% (weak areas)
    const weakCategories = categoryStats
      .filter(category => category.hasData && category.score < 70)
      .sort((a, b) => a.score - b.score) // Sort by lowest score first
      .slice(0, 5); // Limit to top 5 weak areas

    // Generate test recommendations for each weak area
    const recommendations = weakCategories.map(category => {
      const testRecommendations = getTestRecommendationsForCategory(category.id);
      return {
        category: category.name,
        categoryId: category.id,
        currentScore: category.score,
        targetScore: Math.min(category.score + 20, 90), // Target improvement
        color: category.color,
        icon: category.icon,
        description: `Improve your ${category.name.toLowerCase()} skills`,
        tests: testRecommendations,
        priority: category.score < 50 ? 'High' : category.score < 60 ? 'Medium' : 'Low'
      };
    });

    setWeakAreasRecommendations(recommendations);
  };

  // Function to get test recommendations for a specific category
  const getTestRecommendationsForCategory = (categoryId) => {
    const testMap = {
      // Individual cognitive test types
      'numerical_reasoning': [
        { name: 'Advanced Numerical Reasoning', route: '/tests/numerical-reasoning-advanced', difficulty: 'Hard', duration: '35 min' },
        { name: 'Mathematical Problem Solving', route: '/tests/mathematical-problem-solving', difficulty: 'Medium', duration: '30 min' },
        { name: 'Quantitative Analysis', route: '/tests/quantitative-analysis', difficulty: 'Hard', duration: '40 min' }
      ],
      'spatial_reasoning': [
        { name: 'Spatial Visualization Test', route: '/tests/spatial-visualization', difficulty: 'Medium', duration: '25 min' },
        { name: '3D Reasoning Assessment', route: '/tests/3d-reasoning', difficulty: 'Hard', duration: '30 min' },
        { name: 'Pattern Recognition', route: '/tests/pattern-recognition', difficulty: 'Medium', duration: '20 min' }
      ],
      'verbal_reasoning': [
        { name: 'Advanced Verbal Reasoning', route: '/tests/verbal-reasoning-advanced', difficulty: 'Hard', duration: '35 min' },
        { name: 'Reading Comprehension', route: '/tests/reading-comprehension', difficulty: 'Medium', duration: '30 min' },
        { name: 'Critical Reading', route: '/tests/critical-reading', difficulty: 'Hard', duration: '40 min' }
      ],
      'logical_reasoning': [
        { name: 'Logical Thinking Test', route: '/tests/logical-thinking', difficulty: 'Hard', duration: '35 min' },
        { name: 'Deductive Reasoning', route: '/tests/deductive-reasoning', difficulty: 'Medium', duration: '30 min' },
        { name: 'Problem Logic Assessment', route: '/tests/problem-logic', difficulty: 'Hard', duration: '40 min' }
      ],
      'abstract_reasoning': [
        { name: 'Abstract Pattern Test', route: '/tests/abstract-patterns', difficulty: 'Hard', duration: '30 min' },
        { name: 'Non-Verbal Reasoning', route: '/tests/non-verbal-reasoning', difficulty: 'Medium', duration: '25 min' },
        { name: 'Conceptual Thinking', route: '/tests/conceptual-thinking', difficulty: 'Hard', duration: '35 min' }
      ],
      'diagrammatic_reasoning': [
        { name: 'Diagrammatic Logic Test', route: '/tests/diagrammatic-logic', difficulty: 'Hard', duration: '30 min' },
        { name: 'Process Flow Assessment', route: '/tests/process-flow', difficulty: 'Medium', duration: '25 min' },
        { name: 'Systems Thinking', route: '/tests/systems-thinking', difficulty: 'Hard', duration: '35 min' }
      ],
      'analytical_reasoning': [
        { name: 'Analytical Thinking Test', route: '/tests/analytical-thinking', difficulty: 'Hard', duration: '35 min' },
        { name: 'Data Analysis Skills', route: '/tests/data-analysis-skills', difficulty: 'Hard', duration: '40 min' },
        { name: 'Critical Analysis', route: '/tests/critical-analysis', difficulty: 'Medium', duration: '30 min' }
      ],
      // Other test categories
      'technical': [
        { name: 'JavaScript Fundamentals', route: '/tests/javascript-fundamentals', difficulty: 'Medium', duration: '30 min' },
        { name: 'Python Programming', route: '/tests/python-programming', difficulty: 'Medium', duration: '45 min' },
        { name: 'Database Management', route: '/tests/database-management', difficulty: 'Hard', duration: '40 min' }
      ],
      'situational': [
        { name: 'Situational Judgment', route: '/tests/situational-judgment', difficulty: 'Medium', duration: '30 min' },
        { name: 'Workplace Scenarios', route: '/tests/workplace-scenarios', difficulty: 'Medium', duration: '25 min' },
        { name: 'Decision Making', route: '/tests/decision-making', difficulty: 'Hard', duration: '35 min' }
      ]
    };

    return testMap[categoryId] || [
      { name: `${categoryId.replace('_', ' ')} Assessment`, route: `/tests/${categoryId}`, difficulty: 'Medium', duration: '30 min' }
    ];
  };

  // Handle improve weak areas button click
  const handleImproveWeakAreas = () => {
    analyzeWeakAreas();
    setIsWeakAreasModalOpen(true);
  };

  // Helper function to create grouped categories for cards display
  const createGroupedCategoriesForCards = (individualCategories) => {
    const cognitiveTestTypes = [
      'numerical_reasoning', 'spatial_reasoning', 'verbal_reasoning',
      'logical_reasoning', 'abstract_reasoning', 'diagrammatic_reasoning',
      'analytical_reasoning'
    ];

    // Group cognitive tests together
    const cognitiveTests = individualCategories.filter(cat =>
      cognitiveTestTypes.includes(cat.id) && cat.hasData
    );

    // Calculate grouped cognitive stats
    let groupedCognitive = null;
    if (cognitiveTests.length > 0) {
      const totalScore = cognitiveTests.reduce((sum, cat) => sum + cat.score, 0);
      const totalPreviousScore = cognitiveTests.reduce((sum, cat) => sum + cat.previousScore, 0);
      const totalCount = cognitiveTests.reduce((sum, cat) => sum + cat.count, 0);
      const avgConsistency = cognitiveTests.reduce((sum, cat) => sum + cat.consistency, 0) / cognitiveTests.length;
      const bestScore = Math.max(...cognitiveTests.map(cat => cat.bestScore));

      groupedCognitive = {
        id: 'cognitive',
        name: 'Cognitive Skills',
        icon: getCategoryIcon('cognitive'),
        score: Math.round(totalScore / cognitiveTests.length),
        previousScore: Math.round(totalPreviousScore / cognitiveTests.length),
        benchmark: getBenchmarkForCategory('cognitive'),
        description: getCategoryDescription('cognitive'),
        color: getCategoryColor('cognitive'),
        count: totalCount,
        bestScore: bestScore,
        consistency: Math.round(avgConsistency),
        lastTaken: cognitiveTests.reduce((latest, cat) => {
          if (!latest || !cat.lastTaken) return latest || cat.lastTaken;
          return new Date(cat.lastTaken) > new Date(latest) ? cat.lastTaken : latest;
        }, null),
        hasData: true
      };
    }

    // Get non-cognitive categories
    const nonCognitiveCategories = individualCategories.filter(cat =>
      !cognitiveTestTypes.includes(cat.id) && cat.hasData
    );

    // Combine grouped cognitive with other categories
    const result = [];
    if (groupedCognitive) result.push(groupedCognitive);
    result.push(...nonCognitiveCategories);

    return result;
  };

  // Helper function to create comprehensive category mapping with individual cognitive tests
  const createComprehensiveCategoryMapping = (employabilityCategories = null, categoryBreakdown = null) => {
    // Define individual cognitive test categories plus situational and technical
    const coreCategories = [
      'numerical_reasoning', 'spatial_reasoning', 'verbal_reasoning',
      'logical_reasoning', 'abstract_reasoning', 'diagrammatic_reasoning',
      'analytical_reasoning', 'situational', 'technical'
    ];

    const categoryMap = new Map();

    // Process employability score data if available
    if (employabilityCategories) {
      Object.entries(employabilityCategories).forEach(([key, data]) => {
        if (data.count > 0) {
          categoryMap.set(key, {
            id: key,
            score: data.score || 0,
            count: data.count,
            best_score: data.best_score || 0,
            consistency: data.consistency || 0,
            improvement: data.improvement || 0,
            last_taken: data.last_taken,
            hasData: true
          });
        }
      });
    }

    // Process category breakdown data if available
    if (categoryBreakdown) {
      categoryBreakdown.forEach((category) => {
        if (category.count > 0) {
          categoryMap.set(category.test_type, {
            id: category.test_type,
            score: category.average_score || 0,
            count: category.count,
            best_score: category.best_score || 0,
            consistency: 85, // Default consistency
            improvement: 0,
            last_taken: category.last_taken,
            hasData: true
          });
        }
      });

    }

    // Ensure all core categories are represented
    const result = coreCategories.map(categoryId => {
      if (categoryMap.has(categoryId)) {
        return categoryMap.get(categoryId);
      } else {
        // Add category with no data but maintain structure for spider chart
        return {
          id: categoryId,
          score: 0,
          count: 0,
          best_score: 0,
          consistency: 0,
          improvement: 0,
          last_taken: null,
          hasData: false
        };
      }
    });

    // Add any additional categories from the data that aren't in core categories
    categoryMap.forEach((data, key) => {
      if (!coreCategories.includes(key)) {
        result.push(data);
      }
    });

    return result;
  };

  // Helper function to create default categories structure with individual cognitive tests
  const createDefaultCognitiveCategories = () => {
    const defaultCategories = [
      'numerical_reasoning', 'spatial_reasoning', 'verbal_reasoning',
      'logical_reasoning', 'abstract_reasoning', 'diagrammatic_reasoning',
      'analytical_reasoning', 'situational', 'technical'
    ];

    return defaultCategories.map(categoryId => ({
      id: categoryId,
      name: getCategoryDisplayName(categoryId),
      icon: getCategoryIcon(categoryId),
      score: 0,
      previousScore: 0,
      benchmark: getBenchmarkForCategory(categoryId),
      description: getCategoryDescription(categoryId),
      color: getCategoryColor(categoryId),
      count: 0,
      bestScore: 0,
      consistency: 0,
      lastTaken: null,
      hasData: false
    }));
  };

  // Helper functions for category mapping - Individual cognitive test categories
  const getCategoryDisplayName = (key) => {
    const nameMap = {
      // Individual cognitive test types
      'numerical_reasoning': 'Numerical Reasoning',
      'spatial_reasoning': 'Spatial Reasoning',
      'verbal_reasoning': 'Verbal Reasoning',
      'logical_reasoning': 'Logical Reasoning',
      'abstract_reasoning': 'Abstract Reasoning',
      'diagrammatic_reasoning': 'Diagrammatic Reasoning',
      'analytical_reasoning': 'Analytical Reasoning',
      // Other test categories
      'technical': 'Technical Tests',
      'situational': 'Situational Judgment',
      // Fallback for grouped cognitive (for cards display)
      'cognitive': 'Cognitive Skills'
    };
    return nameMap[key] || key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCategoryIcon = (key) => {
    const iconMap = {
      'cognitive': '🧠',
      'technical': '💻',
      'situational': '⚖️',
      'communication': '💬',
      'analytical': '📊',
      'verbal_reasoning': '📖',
      'numerical_reasoning': '🧮',
      'logical_reasoning': '🧩',
      'abstract_reasoning': '🔮',
      'diagrammatic_reasoning': '📊',
      'spatial_reasoning': '🌐'
    };
    return iconMap[key] || '📋';
  };

  const getCategoryColor = (key) => {
    const colorMap = {
      'cognitive': 'blue',
      'technical': 'red',
      'situational': 'emerald',
      'communication': 'purple',
      'analytical': 'teal',
      'verbal_reasoning': 'blue',
      'numerical_reasoning': 'green',
      'logical_reasoning': 'purple',
      'abstract_reasoning': 'indigo',
      'diagrammatic_reasoning': 'teal',
      'spatial_reasoning': 'orange'
    };
    return colorMap[key] || 'gray';
  };

  const getCategoryDescription = (key) => {
    const descriptionMap = {
      'cognitive': 'General cognitive abilities and problem-solving skills',
      'technical': 'Programming concepts and system design',
      'situational': 'Workplace scenarios and decision making',
      'communication': 'Written and verbal communication skills',
      'analytical': 'Data analysis and logical reasoning',
      'verbal_reasoning': 'Reading comprehension, analogies, and language skills',
      'numerical_reasoning': 'Mathematical problem solving and data interpretation',
      'logical_reasoning': 'Pattern recognition and logical sequences',
      'abstract_reasoning': 'Non-verbal reasoning and abstract thinking',
      'diagrammatic_reasoning': 'Flowchart analysis and process understanding',
      'spatial_reasoning': '3D visualization and mental rotation'
    };
    return descriptionMap[key] || 'Assessment of specific skills and abilities';
  };

  const getBenchmarkForCategory = (key) => {
    // Industry benchmarks based on category type
    const benchmarkMap = {
      'cognitive': 70,
      'technical': 75,
      'situational': 65,
      'communication': 68,
      'analytical': 72,
      'verbal_reasoning': 65,
      'numerical_reasoning': 70,
      'logical_reasoning': 68,
      'abstract_reasoning': 60,
      'diagrammatic_reasoning': 65,
      'spatial_reasoning': 60
    };
    return benchmarkMap[key] || 65;
  };

  // Note: Mock data removed - now using only real user-specific data from API

  const getScoreColor = (score, benchmark) => {
    if (score >= benchmark + 15) return 'text-green-600';
    if (score >= benchmark) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score, benchmark) => {
    if (score >= benchmark + 15) return 'bg-green-50 border-green-200';
    if (score >= benchmark) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getScoreIcon = (score, benchmark) => {
    if (score >= benchmark + 15) return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
    if (score >= benchmark) return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />;
    return <XCircleIcon className="w-4 h-4 text-red-600" />;
  };

  const getTrendIcon = (current, previous) => {
    const change = current - previous;
    if (change > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />;
    if (change < 0) return <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />;
    return <MinusIcon className="w-4 h-4 text-gray-400" />;
  };

  const getPerformanceLevel = (score, benchmark) => {
    if (score >= benchmark + 15) return 'Above 70% of candidates';
    if (score >= benchmark) return 'Above 50% of candidates';
    return 'Below 50% of candidates';
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="bg-gray-100 rounded-lg p-8 mb-6">
            <div className="w-72 h-72 bg-gray-200 rounded-full mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border border-gray-200">
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 bg-gray-200 rounded mb-3"></div>
                <div className="h-2 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Career Readiness Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state - when user hasn't taken any tests yet
  if (!loading && categoryStats.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <ChartBarIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Career Readiness Breakdown</h2>
            <p className="text-sm text-gray-500">Performance vs. industry benchmarks</p>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Test Data Available</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Take some tests to see your personalized career readiness breakdown and performance analytics.
          </p>
          <button
            onClick={() => window.location.href = '/tests'}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Take Your First Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <ChartBarIcon className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Career Readiness Breakdown</h2>
          <p className="text-sm text-gray-500">Performance vs. industry benchmarks</p>
        </div>
      </div>

      {/* Benchmark Legend */}
      <div className="flex items-center justify-center space-x-6 mb-6 py-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Above Benchmark</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-gray-600">At Benchmark</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Below Benchmark</span>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <RadarChart data={categoryStats} size={300} />
        </div>
      </div>

      {/* Skills Grid - Show grouped categories (max 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {groupedCategoryStats.slice(0, 3).map((category) => {
          const change = category.score - category.previousScore;
          const isImproving = change > 0;
          
          return (
            <div
              key={category.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === category.id 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              {/* Vertical Layout: Icon, Category Name, Score */}
              <div className="text-center mb-3">
                {/* Emoji Icon */}
                <div className="mb-2">
                  <span className="text-xl">{category.icon}</span>
                </div>

                {/* Test Category Name - Multi-line Format */}
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-600 leading-tight">
                    {category.id === 'cognitive' ? (
                      <>
                        Cognitive<br />Skills
                      </>
                    ) : category.id === 'technical' ? (
                      <>
                        Technical<br />Skills
                      </>
                    ) : category.id === 'situational' ? (
                      <>
                        Situational<br />Judgment
                      </>
                    ) : (
                      category.name
                    )}
                  </span>
                </div>

                {/* Score Display */}
                <div className="mb-1">
                  <span className={`text-2xl font-bold ${getScoreColor(category.score, category.benchmark)}`}>
                    {category.score}
                  </span>
                  <span className="text-xs text-gray-500">/100</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    category.score >= category.benchmark + 15 ? 'bg-green-500' :
                    category.score >= category.benchmark ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(category.score, 100)}%` }}
                />
              </div>

              {/* Performance Info */}
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1 leading-tight px-1">
                  {getPerformanceLevel(category.score, category.benchmark)}
                </div>

                {/* Trend */}
                <div className="flex items-center justify-center space-x-1">
                  {getTrendIcon(category.score, category.previousScore)}
                  <span className={`text-xs font-medium ${
                    isImproving ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {isImproving ? '+' : ''}{change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Category Details */}
      {selectedCategory && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          {(() => {
            const category = categoryStats.find(c => c.id === selectedCategory);
            if (!category) return null;

            return (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{category.score}</div>
                    <div className="text-xs text-gray-500">Current Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{category.benchmark}</div>
                    <div className="text-xs text-gray-500">Benchmark</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {category.score - category.previousScore > 0 ? '+' : ''}{category.score - category.previousScore}
                    </div>
                    <div className="text-xs text-gray-500">Change</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{category.count}</div>
                    <div className="text-xs text-gray-500">Tests Taken</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          View Detailed Analysis
        </button>
        <button
          onClick={handleImproveWeakAreas}
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Improve Weak Areas
        </button>
      </div>

      {/* Career Readiness Modal */}
      <CareerReadinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={breakdownData}
        categoryStats={categoryStats}
        employabilityData={employabilityData}
      />

      {/* Weak Areas Recommendations Modal */}
      <WeakAreasModal
        isOpen={isWeakAreasModalOpen}
        onClose={() => setIsWeakAreasModalOpen(false)}
        recommendations={weakAreasRecommendations}
      />
    </div>
  );
};

export default CareerReadinessBreakdown;
