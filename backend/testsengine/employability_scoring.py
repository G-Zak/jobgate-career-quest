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

 # Individual test types (for spider charts)
 INDIVIDUAL_TEST_TYPES = [
 'verbal_reasoning',
 'numerical_reasoning',
 'logical_reasoning',
 'abstract_reasoning',
 'spatial_reasoning',
 'diagrammatic_reasoning',
 'analytical_reasoning',
 'situational_judgment',
 'technical'
 ]

 # Test type to category mapping (for grouped cards) - REMOVED COGNITIVE GROUPING
 TEST_CATEGORY_MAPPING = {
 'verbal_reasoning': 'verbal_reasoning',
 'numerical_reasoning': 'numerical_reasoning',
 'logical_reasoning': 'logical_reasoning',
 'abstract_reasoning': 'abstract_reasoning',
 'spatial_reasoning': 'spatial_reasoning',
 'diagrammatic_reasoning': 'diagrammatic_reasoning',
 'analytical_reasoning': 'analytical_reasoning',
 'situational_judgment': SITUATIONAL,
 'technical': TECHNICAL,
 }

 # Grouping for cards display - REMOVED COGNITIVE GROUPING
 CARD_GROUPINGS = {
 'situational': ['situational_judgment'],
 'cognitive': ['verbal_reasoning', 'numerical_reasoning', 'logical_reasoning', 'abstract_reasoning', 'spatial_reasoning', 'diagrammatic_reasoning', 'analytical_reasoning'],
 'technical': ['technical']
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

 @classmethod
 def get_individual_test_types(cls) -> List[str]:
 """Get all individual test types for spider chart display"""
 return cls.INDIVIDUAL_TEST_TYPES

 @classmethod
 def get_card_groupings(cls) -> Dict[str, List[str]]:
 """Get test type groupings for card display"""
 return cls.CARD_GROUPINGS

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

 def calculate_individual_test_scores(self) -> Dict[str, Dict]:
 """Calculate scores for individual test types (for spider charts)"""
 test_scores = {}

 # Get all completed test sessions for the user
 completed_sessions = TestSession.objects.filter(
 user=self.user,
 status='completed',
 score__isnull=False
 ).select_related('test')

 # Group sessions by individual test type
 for test_type in self.categories.get_individual_test_types():
 test_sessions = completed_sessions.filter(test__test_type=test_type)

 if test_sessions.exists():
 scores = [session.score for session in test_sessions]
 test_scores[test_type] = {
 'score': round(statistics.mean(scores), 2),
 'count': len(scores),
 'best_score': max(scores),
 'consistency': self._calculate_consistency(scores),
 'recent_trend': self._calculate_recent_trend(test_sessions),
 'last_updated': max(session.start_time for session in test_sessions)
 }
 else:
 test_scores[test_type] = {
 'score': 0,
 'count': 0,
 'best_score': 0,
 'consistency': 0,
 'recent_trend': 0,
 'last_updated': None
 }

 return test_scores

 def calculate_category_scores(self) -> Dict[str, Dict]:
 """Calculate scores for each individual test type (no more grouping)"""
 category_scores = {}

 # Get all completed test sessions for the user
 completed_sessions = TestSession.objects.filter(
 user=self.user,
 status='completed',
 score__isnull=False
 ).select_related('test')

 # Calculate scores for each individual test type
 for test_type in self.categories.get_individual_test_types():
 test_sessions = completed_sessions.filter(test__test_type=test_type)

 if test_sessions.exists():
 scores = [session.score for session in test_sessions]
 category_scores[test_type] = {
 'score': round(statistics.mean(scores), 2),
 'count': len(scores),
 'best_score': max(scores),
 'consistency': self._calculate_consistency(scores),
 'recent_trend': self._calculate_recent_trend(test_sessions),
 'last_updated': max(session.start_time for session in test_sessions)
 }
 else:
 category_scores[test_type] = {
 'score': 0,
 'count': 0,
 'best_score': 0,
 'consistency': 0,
 'recent_trend': 0,
 'last_updated': None
 }

 # Also include situational and technical as separate categories
 for category in [self.categories.SITUATIONAL, self.categories.TECHNICAL]:
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
 return 100.0 # Perfect consistency for single score

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
 individual_test_scores = self.calculate_individual_test_scores()

 # Calculate overall score using profile-specific weights if profile is provided
 if profile and category_scores:
 # Get profile weights
 profile_weights = self.profile_weights.get_weights_for_profile(profile)

 # Aggregate individual test scores into high-level categories
 aggregated_categories = {}

 # Cognitive category: average of all cognitive test types
 cognitive_tests = ['verbal_reasoning', 'numerical_reasoning', 'logical_reasoning',
 'abstract_reasoning', 'spatial_reasoning', 'diagrammatic_reasoning', 'analytical_reasoning']
 cognitive_scores = [category_scores[test]['score'] for test in cognitive_tests
 if test in category_scores and category_scores[test]['count'] > 0]
 if cognitive_scores:
 aggregated_categories['cognitive'] = statistics.mean(cognitive_scores)

 # Situational category
 if 'situational' in category_scores and category_scores['situational']['count'] > 0:
 aggregated_categories['situational'] = category_scores['situational']['score']

 # Technical category
 if 'technical' in category_scores and category_scores['technical']['count'] > 0:
 aggregated_categories['technical'] = category_scores['technical']['score']

 # Analytical category (could be separate or part of cognitive)
 if 'analytical_reasoning' in category_scores and category_scores['analytical_reasoning']['count'] > 0:
 aggregated_categories['analytical'] = category_scores['analytical_reasoning']['score']
 elif cognitive_scores: # Fallback to cognitive average
 aggregated_categories['analytical'] = statistics.mean(cognitive_scores)

 # Communication category (not implemented yet, use cognitive as fallback)
 if cognitive_scores:
 aggregated_categories['communication'] = statistics.mean(cognitive_scores)

 # Calculate weighted score based on aggregated categories
 weighted_score = 0.0
 total_weight = 0.0

 for category, weight in profile_weights.items():
 if category in aggregated_categories:
 weighted_score += aggregated_categories[category] * weight
 total_weight += weight

 # Normalize by actual weights used (in case some categories have no data)
 overall_score = weighted_score / total_weight if total_weight > 0 else 0
 else:
 # Fallback: Calculate simple average of all completed individual test scores
 completed_scores = []
 for test_type, data in individual_test_scores.items():
 if data['count'] > 0:
 completed_scores.append(data['score'])

 overall_score = statistics.mean(completed_scores) if completed_scores else 0

 # Calculate additional metrics
 total_tests = sum(data['count'] for data in individual_test_scores.values())

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
 'profile_weights': self.profile_weights.get_weights_for_profile(profile) if profile else None,
 'categories': category_scores,
 'individual_test_scores': individual_test_scores, # Add individual test scores
 'total_tests_completed': total_tests,
 'improvement_trend': improvement_trend,
 'last_updated': timezone.now(),
 'score_interpretation': self._get_score_interpretation(overall_score),
 'recommendations': self._get_recommendations(category_scores, profile)
 }

 def _calculate_overall_trend(self, sessions: List) -> float:
 """Calculate overall improvement trend across all tests"""
 if len(sessions) < 4: # Need at least 4 tests for meaningful trend
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
 for category, data in sorted_categories[:2]: # Top 2 improvement areas
 if data['score'] < 75: # Only recommend if below good threshold
 # Handle individual test types vs traditional categories
 if category in self.categories.CATEGORY_INFO:
 category_info = self.categories.CATEGORY_INFO[category]
 category_name = category_info['name']
 else:
 # For individual test types, create readable names
 category_name = category.replace('_', ' ').title()

 # Create description based on category type
 if category in self.categories.CATEGORY_INFO:
 category_info = self.categories.CATEGORY_INFO[category]
 description = f"Your {category_info['name'].lower()} score is {data['score']}/100. Focus on {category_info['description'].lower()}."
 else:
 description = f"Your {category_name.lower()} score is {data['score']}/100. Practice more {category_name.lower()} tests to improve."

 recommendations.append({
 'type': 'improvement',
 'category': category,
 'title': f"Improve {category_name}",
 'description': description,
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
