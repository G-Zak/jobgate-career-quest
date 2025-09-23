from django.db.models import Avg, Count, Q, Max
from django.utils import timezone
from datetime import timedelta
from testsengine.models import TestSession, Test
from .cache_utils import cache_manager, cache_achievements
import logging

logger = logging.getLogger(__name__)


class AchievementsService:
    """
    Service for calculating user achievements based on test performance
    """
    
    def __init__(self, user):
        self.user = user
        self.sessions = TestSession.objects.filter(user=user).select_related('test')
    
    def calculate_all_achievements(self):
        """
        Calculate all available achievements for the user with caching
        """
        # Try to get from cache first
        cached_achievements = cache_manager.get_user_achievements(self.user.id)
        if cached_achievements:
            return cached_achievements
        
        achievements = []
        
        # Get basic stats
        total_tests = self.sessions.count()
        if total_tests == 0:
            achievements = self._get_unearned_achievements()
        else:
            # Calculate each achievement
            achievements.extend(self._calculate_perfect_score_achievement())
            achievements.extend(self._calculate_test_master_achievement(total_tests))
            achievements.extend(self._calculate_improvement_achievement())
            achievements.extend(self._calculate_speed_master_achievement())
            achievements.extend(self._calculate_versatile_learner_achievement())
            achievements.extend(self._calculate_first_step_achievement(total_tests))
        
        # Cache the results
        cache_manager.set_user_achievements(self.user.id, achievements)
        
        return achievements
    
    def _calculate_perfect_score_achievement(self):
        """Calculate Perfect Score achievement"""
        perfect_scores = self.sessions.filter(score=100).count()
        
        return [{
            'id': 1,
            'title': "Perfect Score",
            'description': "Achieve a perfect score on any test",
            'icon': "🎯",
            'color': "gold",
            'earned': perfect_scores > 0,
            'progress': min(100, perfect_scores * 100),
            'requirement': "Score 100% on any test",
            'current_value': f"{perfect_scores} perfect score{'s' if perfect_scores != 1 else ''}"
        }]
    
    def _calculate_test_master_achievement(self, total_tests):
        """Calculate Test Master achievement"""
        earned = total_tests >= 10
        
        return [{
            'id': 2,
            'title': "Test Master",
            'description': "Complete 10 or more tests",
            'icon': "🏆",
            'color': "blue",
            'earned': earned,
            'progress': min(100, (total_tests / 10) * 100),
            'requirement': "Complete 10 tests",
            'current_value': f"{total_tests}/10 tests completed"
        }]
    
    def _calculate_improvement_achievement(self):
        """Calculate Improvement achievement"""
        if self.sessions.count() < 2:
            return [{
                'id': 3,
                'title': "Improvement",
                'description': "Show consistent improvement over time",
                'icon': "📈",
                'color': "green",
                'earned': False,
                'progress': 0,
                'requirement': "Improve average score over time",
                'current_value': "Need at least 2 tests"
            }]
        
        # Get recent vs older performance
        recent_sessions = self.sessions.order_by('-start_time')[:3]
        older_sessions = self.sessions.order_by('-start_time')[3:6]
        
        recent_avg = recent_sessions.aggregate(avg=Avg('score'))['avg'] or 0
        older_avg = older_sessions.aggregate(avg=Avg('score'))['avg'] or 0
        
        improvement = recent_avg - older_avg
        earned = improvement > 0
        
        return [{
            'id': 3,
            'title': "Improvement",
            'description': "Show consistent improvement over time",
            'icon': "📈",
            'color': "green",
            'earned': earned,
            'progress': min(100, max(0, improvement * 2)),  # Scale improvement to 0-100
            'requirement': "Improve average score over time",
            'current_value': f"Recent avg: {recent_avg:.1f}% vs Older avg: {older_avg:.1f}%"
        }]
    
    def _calculate_speed_master_achievement(self):
        """Calculate Speed Master achievement"""
        # Find sessions with time_spent data
        timed_sessions = self.sessions.filter(time_spent__isnull=False, time_spent__gt=0)
        
        if timed_sessions.count() < 3:
            return [{
                'id': 4,
                'title': "Speed Master",
                'description': "Complete tests quickly while maintaining good scores",
                'icon': "⚡",
                'color': "orange",
                'earned': False,
                'progress': 0,
                'requirement': "Complete tests quickly with good scores",
                'current_value': "Need at least 3 timed tests"
            }]
        
        # Calculate average time per question
        total_questions = sum(session.test.total_questions for session in timed_sessions if session.test)
        total_time = sum(session.time_spent for session in timed_sessions)
        
        if total_questions == 0:
            return [{
                'id': 4,
                'title': "Speed Master",
                'description': "Complete tests quickly while maintaining good scores",
                'icon': "⚡",
                'color': "orange",
                'earned': False,
                'progress': 0,
                'requirement': "Complete tests quickly with good scores",
                'current_value': "No question data available"
            }]
        
        avg_time_per_question = total_time / total_questions
        avg_score = timed_sessions.aggregate(avg=Avg('score'))['avg'] or 0
        
        # Speed master: complete tests in under 2 minutes per question with score > 70%
        earned = avg_time_per_question < 120 and avg_score > 70  # 2 minutes = 120 seconds
        
        progress = min(100, max(0, (120 - avg_time_per_question) / 120 * 100))
        
        return [{
            'id': 4,
            'title': "Speed Master",
            'description': "Complete tests quickly while maintaining good scores",
            'icon': "⚡",
            'color': "orange",
            'earned': earned,
            'progress': progress,
            'requirement': "Complete tests in <2min/question with >70% score",
            'current_value': f"{avg_time_per_question:.1f}s/question, {avg_score:.1f}% avg score"
        }]
    
    def _calculate_versatile_learner_achievement(self):
        """Calculate Versatile Learner achievement"""
        # Count unique test types
        unique_types = self.sessions.values('test__test_type').distinct().count()
        
        earned = unique_types >= 3
        
        return [{
            'id': 5,
            'title': "Versatile Learner",
            'description': "Take tests across different categories",
            'icon': "🌟",
            'color': "purple",
            'earned': earned,
            'progress': min(100, (unique_types / 3) * 100),
            'requirement': "Take tests in 3+ different categories",
            'current_value': f"{unique_types}/3 different test types"
        }]
    
    def _calculate_first_step_achievement(self, total_tests):
        """Calculate First Step achievement"""
        earned = total_tests >= 1
        
        return [{
            'id': 6,
            'title': "First Step",
            'description': "Complete your first assessment",
            'icon': "🌟",
            'color': "purple",
            'earned': earned,
            'progress': min(100, total_tests * 100),
            'requirement': "Complete your first test",
            'current_value': f"{total_tests} test{'s' if total_tests != 1 else ''} completed"
        }]
    
    def _get_unearned_achievements(self):
        """Return all achievements as unearned for new users"""
        return [
            {
                'id': 1,
                'title': "Perfect Score",
                'description': "Achieve a perfect score on any test",
                'icon': "🎯",
                'color': "gold",
                'earned': False,
                'progress': 0,
                'requirement': "Score 100% on any test",
                'current_value': "0 perfect scores"
            },
            {
                'id': 2,
                'title': "Test Master",
                'description': "Complete 10 or more tests",
                'icon': "🏆",
                'color': "blue",
                'earned': False,
                'progress': 0,
                'requirement': "Complete 10 tests",
                'current_value': "0/10 tests completed"
            },
            {
                'id': 3,
                'title': "Improvement",
                'description': "Show consistent improvement over time",
                'icon': "📈",
                'color': "green",
                'earned': False,
                'progress': 0,
                'requirement': "Improve average score over time",
                'current_value': "Need at least 2 tests"
            },
            {
                'id': 4,
                'title': "Speed Master",
                'description': "Complete tests quickly while maintaining good scores",
                'icon': "⚡",
                'color': "orange",
                'earned': False,
                'progress': 0,
                'requirement': "Complete tests quickly with good scores",
                'current_value': "Need at least 3 timed tests"
            },
            {
                'id': 5,
                'title': "Versatile Learner",
                'description': "Take tests across different categories",
                'icon': "🌟",
                'color': "purple",
                'earned': False,
                'progress': 0,
                'requirement': "Take tests in 3+ different categories",
                'current_value': "0/3 different test types"
            },
            {
                'id': 6,
                'title': "First Step",
                'description': "Complete your first assessment",
                'icon': "🌟",
                'color': "purple",
                'earned': False,
                'progress': 0,
                'requirement': "Complete your first test",
                'current_value': "0 tests completed"
            }
        ]
    
    def get_achievement_summary(self):
        """
        Get a summary of achievements with statistics
        """
        achievements = self.calculate_all_achievements()
        earned_count = len([a for a in achievements if a['earned']])
        total_count = len(achievements)
        
        return {
            'achievements': achievements,
            'total_earned': earned_count,
            'total_available': total_count,
            'completion_percentage': round((earned_count / total_count) * 100, 1) if total_count > 0 else 0,
            'next_achievements': [a for a in achievements if not a['earned']][:3]  # Next 3 to earn
        }
