"""
Employability Scoring System

This module provides comprehensive employability scoring functionality that:
1. Maps test types to employability categories
2. Calculates category-specific scores
3. Applies profile-based weighting
4. Provides growth and consistency metrics
"""

from django.db.models import Avg, Count, Max, Min, StdDev
from django.utils import timezone
from datetime import timedelta
from typing import Dict, List, Optional, Tuple
import statistics
from .models import TestSession, Test


class EmployabilityCategories:
    """Define employability categories and their mappings"""
    
    # Core employability categories
    COGNITIVE = 'cognitive'
    TECHNICAL = 'technical'
    SITUATIONAL = 'situational'
    COMMUNICATION = 'communication'
    ANALYTICAL = 'analytical'
    
    # Test type to category mapping
    TEST_CATEGORY_MAPPING = {
        'verbal_reasoning': COGNITIVE,
        'numerical_reasoning': ANALYTICAL,
        'logical_reasoning': COGNITIVE,
        'abstract_reasoning': COGNITIVE,
        'spatial_reasoning': ANALYTICAL,
        'situational_judgment': SITUATIONAL,
        'technical': TECHNICAL,
    }
    
    # Category display names and descriptions
    CATEGORY_INFO = {
        COGNITIVE: {
            'name': 'Cognitive Abilities',
            'description': 'Logical thinking, reasoning, and problem-solving skills',
            'icon': 'brain'
        },
        TECHNICAL: {
            'name': 'Technical Skills',
            'description': 'Domain-specific technical knowledge and expertise',
            'icon': 'code'
        },
        SITUATIONAL: {
            'name': 'Situational Judgment',
            'description': 'Decision-making and interpersonal skills in workplace scenarios',
            'icon': 'users'
        },
        COMMUNICATION: {
            'name': 'Communication',
            'description': 'Verbal and written communication effectiveness',
            'icon': 'message'
        },
        ANALYTICAL: {
            'name': 'Analytical Thinking',
            'description': 'Data analysis, mathematical reasoning, and quantitative skills',
            'icon': 'chart'
        }
    }
    
    @classmethod
    def get_category_for_test_type(cls, test_type: str) -> str:
        """Get the employability category for a given test type"""
        return cls.TEST_CATEGORY_MAPPING.get(test_type, cls.COGNITIVE)
    
    @classmethod
    def get_all_categories(cls) -> List[str]:
        """Get all available categories"""
        return list(cls.CATEGORY_INFO.keys())


class ProfileWeights:
    """Define profile-specific weighting schemes"""
    
    # Profile weighting configurations
    PROFILE_WEIGHTS = {
        'Software Engineer': {
            EmployabilityCategories.TECHNICAL: 0.35,
            EmployabilityCategories.COGNITIVE: 0.25,
            EmployabilityCategories.ANALYTICAL: 0.20,
            EmployabilityCategories.SITUATIONAL: 0.15,
            EmployabilityCategories.COMMUNICATION: 0.05,
        },
        'Data Scientist': {
            EmployabilityCategories.ANALYTICAL: 0.40,
            EmployabilityCategories.TECHNICAL: 0.25,
            EmployabilityCategories.COGNITIVE: 0.20,
            EmployabilityCategories.COMMUNICATION: 0.10,
            EmployabilityCategories.SITUATIONAL: 0.05,
        },
        'Product Manager': {
            EmployabilityCategories.SITUATIONAL: 0.30,
            EmployabilityCategories.COMMUNICATION: 0.25,
            EmployabilityCategories.ANALYTICAL: 0.20,
            EmployabilityCategories.COGNITIVE: 0.15,
            EmployabilityCategories.TECHNICAL: 0.10,
        },
        'UX Designer': {
            EmployabilityCategories.COGNITIVE: 0.30,
            EmployabilityCategories.COMMUNICATION: 0.25,
            EmployabilityCategories.SITUATIONAL: 0.20,
            EmployabilityCategories.ANALYTICAL: 0.15,
            EmployabilityCategories.TECHNICAL: 0.10,
        },
        'DevOps Engineer': {
            EmployabilityCategories.TECHNICAL: 0.40,
            EmployabilityCategories.ANALYTICAL: 0.25,
            EmployabilityCategories.COGNITIVE: 0.20,
            EmployabilityCategories.SITUATIONAL: 0.10,
            EmployabilityCategories.COMMUNICATION: 0.05,
        },
        'Financial Analyst': {
            EmployabilityCategories.ANALYTICAL: 0.35,
            EmployabilityCategories.COGNITIVE: 0.25,
            EmployabilityCategories.SITUATIONAL: 0.20,
            EmployabilityCategories.COMMUNICATION: 0.15,
            EmployabilityCategories.TECHNICAL: 0.05,
        },
        'Mechanical Engineer': {
            EmployabilityCategories.ANALYTICAL: 0.30,
            EmployabilityCategories.TECHNICAL: 0.25,
            EmployabilityCategories.COGNITIVE: 0.25,
            EmployabilityCategories.SITUATIONAL: 0.15,
            EmployabilityCategories.COMMUNICATION: 0.05,
        },
        'Marketing Manager': {
            EmployabilityCategories.COMMUNICATION: 0.30,
            EmployabilityCategories.SITUATIONAL: 0.25,
            EmployabilityCategories.ANALYTICAL: 0.20,
            EmployabilityCategories.COGNITIVE: 0.15,
            EmployabilityCategories.TECHNICAL: 0.10,
        }
    }
    
    # Default weights for unknown profiles
    DEFAULT_WEIGHTS = {
        EmployabilityCategories.COGNITIVE: 0.25,
        EmployabilityCategories.TECHNICAL: 0.20,
        EmployabilityCategories.ANALYTICAL: 0.20,
        EmployabilityCategories.SITUATIONAL: 0.20,
        EmployabilityCategories.COMMUNICATION: 0.15,
    }
    
    @classmethod
    def get_weights_for_profile(cls, profile: str) -> Dict[str, float]:
        """Get weighting scheme for a specific profile"""
        return cls.PROFILE_WEIGHTS.get(profile, cls.DEFAULT_WEIGHTS)
    
    @classmethod
    def get_available_profiles(cls) -> List[str]:
        """Get all available profiles"""
        return list(cls.PROFILE_WEIGHTS.keys())


class EmployabilityScorer:
    """Main class for calculating employability scores"""
    
    def __init__(self, user):
        self.user = user
        self.categories = EmployabilityCategories()
        self.profile_weights = ProfileWeights()
    
    def calculate_category_scores(self) -> Dict[str, Dict]:
        """Calculate scores for each employability category"""
        category_scores = {}
        
        # Get all completed test sessions for the user
        completed_sessions = TestSession.objects.filter(
            user=self.user,
            status='completed',
            score__isnull=False
        ).select_related('test')
        
        # Group sessions by category
        for category in self.categories.get_all_categories():
            category_sessions = []
            
            for session in completed_sessions:
                test_category = self.categories.get_category_for_test_type(session.test.test_type)
                if test_category == category:
                    category_sessions.append(session)
            
            if category_sessions:
                scores = [session.score for session in category_sessions]
                category_scores[category] = {
                    'score': round(statistics.mean(scores), 2),
                    'count': len(scores),
                    'best_score': max(scores),
                    'consistency': self._calculate_consistency(scores),
                    'recent_trend': self._calculate_recent_trend(category_sessions),
                    'last_updated': max(session.start_time for session in category_sessions)
                }
            else:
                category_scores[category] = {
                    'score': 0,
                    'count': 0,
                    'best_score': 0,
                    'consistency': 0,
                    'recent_trend': 0,
                    'last_updated': None
                }
        
        return category_scores
    
    def _calculate_consistency(self, scores: List[float]) -> float:
        """Calculate consistency score (lower variance = higher consistency)"""
        if len(scores) < 2:
            return 100.0  # Perfect consistency for single score
        
        variance = statistics.variance(scores)
        # Convert variance to consistency score (0-100, higher is better)
        # Normalize based on typical score variance (0-400 variance -> 100-0 consistency)
        consistency = max(0, 100 - (variance / 4))
        return round(consistency, 2)
    
    def _calculate_recent_trend(self, sessions: List) -> float:
        """Calculate improvement trend (positive = improving, negative = declining)"""
        if len(sessions) < 2:
            return 0.0
        
        # Sort by date
        sorted_sessions = sorted(sessions, key=lambda x: x.start_time)
        
        # Compare recent half vs older half
        mid_point = len(sorted_sessions) // 2
        older_scores = [s.score for s in sorted_sessions[:mid_point]]
        recent_scores = [s.score for s in sorted_sessions[mid_point:]]
        
        if older_scores and recent_scores:
            trend = statistics.mean(recent_scores) - statistics.mean(older_scores)
            return round(trend, 2)
        
        return 0.0

    def calculate_overall_score(self, profile: str = None) -> Dict:
        """Calculate overall employability score with profile weighting"""
        category_scores = self.calculate_category_scores()

        # Get profile weights
        weights = self.profile_weights.get_weights_for_profile(profile) if profile else self.profile_weights.DEFAULT_WEIGHTS

        # Calculate weighted overall score
        weighted_sum = 0
        total_weight = 0

        for category, weight in weights.items():
            if category in category_scores and category_scores[category]['count'] > 0:
                weighted_sum += category_scores[category]['score'] * weight
                total_weight += weight

        # Calculate overall score (0-100)
        overall_score = (weighted_sum / total_weight) if total_weight > 0 else 0

        # Calculate additional metrics
        total_tests = sum(cat['count'] for cat in category_scores.values())

        # Calculate overall improvement trend
        all_sessions = TestSession.objects.filter(
            user=self.user,
            status='completed',
            score__isnull=False
        ).order_by('start_time')

        improvement_trend = self._calculate_overall_trend(list(all_sessions))

        return {
            'overall_score': round(overall_score, 2),
            'profile': profile,
            'categories': category_scores,
            'total_tests_completed': total_tests,
            'improvement_trend': improvement_trend,
            'last_updated': timezone.now(),
            'score_interpretation': self._get_score_interpretation(overall_score),
            'recommendations': self._get_recommendations(category_scores, profile)
        }

    def _calculate_overall_trend(self, sessions: List) -> float:
        """Calculate overall improvement trend across all tests"""
        if len(sessions) < 4:  # Need at least 4 tests for meaningful trend
            return 0.0

        # Split into quarters and compare recent vs older performance
        quarter_size = len(sessions) // 4
        older_quarter = sessions[:quarter_size]
        recent_quarter = sessions[-quarter_size:]

        older_avg = statistics.mean([s.score for s in older_quarter])
        recent_avg = statistics.mean([s.score for s in recent_quarter])

        return round(recent_avg - older_avg, 2)

    def _get_score_interpretation(self, score: float) -> Dict:
        """Get interpretation and context for the score"""
        if score >= 90:
            return {
                'level': 'Excellent',
                'description': 'Job-ready with exceptional skills',
                'market_position': 'Top 10% of candidates',
                'color': 'green'
            }
        elif score >= 80:
            return {
                'level': 'Very Good',
                'description': 'Highly competitive candidate',
                'market_position': 'Top 25% of candidates',
                'color': 'green'
            }
        elif score >= 70:
            return {
                'level': 'Good',
                'description': 'Solid foundation with room for growth',
                'market_position': 'Above average candidate',
                'color': 'yellow'
            }
        elif score >= 60:
            return {
                'level': 'Average',
                'description': 'Meets basic requirements',
                'market_position': 'Average candidate',
                'color': 'yellow'
            }
        else:
            return {
                'level': 'Needs Improvement',
                'description': 'Significant development needed',
                'market_position': 'Below average - focus on skill building',
                'color': 'red'
            }

    def _get_recommendations(self, category_scores: Dict, profile: str = None) -> List[Dict]:
        """Generate personalized recommendations based on scores"""
        recommendations = []

        # Find weakest categories
        scored_categories = {k: v for k, v in category_scores.items() if v['count'] > 0}

        if scored_categories:
            # Sort by score to find improvement areas
            sorted_categories = sorted(scored_categories.items(), key=lambda x: x[1]['score'])

            # Recommend improvement for lowest scoring categories
            for category, data in sorted_categories[:2]:  # Top 2 improvement areas
                if data['score'] < 75:  # Only recommend if below good threshold
                    category_info = self.categories.CATEGORY_INFO[category]
                    recommendations.append({
                        'type': 'improvement',
                        'category': category,
                        'title': f"Improve {category_info['name']}",
                        'description': f"Your {category_info['name'].lower()} score is {data['score']}/100. Focus on {category_info['description'].lower()}.",
                        'priority': 'high' if data['score'] < 60 else 'medium'
                    })

        # Recommend taking more tests if overall test count is low
        total_tests = sum(cat['count'] for cat in category_scores.values())
        if total_tests < 5:
            recommendations.append({
                'type': 'assessment',
                'title': 'Take More Assessments',
                'description': f"You've completed {total_tests} tests. Take more assessments to get a comprehensive employability score.",
                'priority': 'medium'
            })

        return recommendations
