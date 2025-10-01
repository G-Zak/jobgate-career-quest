from django.contrib.auth.models import User
from django.db.models import Avg, Count, Max
import logging

logger = logging.getLogger(__name__)

try:
    from testsengine.models import TestSession, Test
except ImportError:
    TestSession = None
    Test = None


class AchievementsService:
    """
    Service for calculating user achievements based on test performance
    """

    def __init__(self, user):
        self.user = user
        if TestSession:
            self.sessions = TestSession.objects.filter(user=user).select_related('test')
        else:
            self.sessions = []

    def get_achievement_summary(self):
        """
        Get a summary of user achievements
        """
        try:
            if not TestSession:
                return {
                    'achievements': [],
                    'total_earned': 0,
                    'total_available': 0,
                    'completion_percentage': 0,
                    'next_achievements': []
                }

            total_tests = self.sessions.count()
            achievements = []
            
            # Basic achievements based on test count
            if total_tests >= 1:
                achievements.append({
                    'id': 'first_test',
                    'name': 'First Steps',
                    'description': 'Completed your first test',
                    'earned': True,
                    'earned_date': self.sessions.first().created_at if self.sessions.exists() else None
                })
            
            if total_tests >= 5:
                achievements.append({
                    'id': 'test_taker',
                    'name': 'Test Taker',
                    'description': 'Completed 5 tests',
                    'earned': True,
                    'earned_date': None
                })
            
            if total_tests >= 10:
                achievements.append({
                    'id': 'dedicated_learner',
                    'name': 'Dedicated Learner',
                    'description': 'Completed 10 tests',
                    'earned': True,
                    'earned_date': None
                })

            # Calculate average score if we have sessions
            if self.sessions.exists():
                avg_score = self.sessions.aggregate(avg=Avg('score'))['avg'] or 0
                if avg_score >= 80:
                    achievements.append({
                        'id': 'high_achiever',
                        'name': 'High Achiever',
                        'description': 'Maintain an average score of 80% or higher',
                        'earned': True,
                        'earned_date': None
                    })

            next_achievements = []
            if total_tests < 5:
                next_achievements.append({
                    'id': 'test_taker',
                    'name': 'Test Taker',
                    'description': 'Complete 5 tests',
                    'progress': total_tests,
                    'target': 5
                })
            elif total_tests < 10:
                next_achievements.append({
                    'id': 'dedicated_learner',
                    'name': 'Dedicated Learner',
                    'description': 'Complete 10 tests',
                    'progress': total_tests,
                    'target': 10
                })

            return {
                'achievements': achievements,
                'total_earned': len(achievements),
                'total_available': 10,  # Total possible achievements
                'completion_percentage': (len(achievements) / 10) * 100,
                'next_achievements': next_achievements
            }

        except Exception as e:
            logger.error(f"Error calculating achievements: {str(e)}")
            return {
                'achievements': [],
                'total_earned': 0,
                'total_available': 0,
                'completion_percentage': 0,
                'next_achievements': []
            }