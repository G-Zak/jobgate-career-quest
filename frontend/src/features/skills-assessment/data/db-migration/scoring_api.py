"""
REST API views for scoring system
Provides endpoints for calculating scores and retrieving score analytics
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count, Q
from decimal import Decimal
import json

from .models import (
    TestScore, ScoringProfile, CategoryScore,
    UserTestSession, TestScoreCalculator
)
from .serializers import (
    TestScoreSerializer, ScoringProfileSerializer,
    CategoryScoreSerializer, ScoreAnalyticsSerializer
)


class ScoringProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for scoring profiles
    """
    queryset = ScoringProfile.objects.filter(is_active=True)
    serializer_class = ScoringProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        test_type = self.request.query_params.get('test_type')
        if test_type:
            queryset = queryset.filter(test_type=test_type)
        return queryset


class TestScoreViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for test scores with detailed analytics
    """
    serializer_class = TestScoreSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TestScore.objects.filter(
            session__user=self.request.user
        ).select_related('session', 'scoring_profile')

    @action(detail=False, methods=['post'])
    def calculate_score(self, request):
        """
        Calculate score for a completed test session
        """
        session_id = request.data.get('session_id')
        scoring_profile_id = request.data.get('scoring_profile_id')

        if not session_id:
            return Response(
                {'error': 'session_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get session and verify ownership
        session = get_object_or_404(
            UserTestSession,
            id=session_id,
            user=request.user,
            status='completed'
        )

        # Get scoring profile
        if scoring_profile_id:
            scoring_profile = get_object_or_404(
                ScoringProfile,
                id=scoring_profile_id,
                is_active=True
            )
        else:
            # Use default scoring profile for test type
            scoring_profile = ScoringProfile.objects.filter(
                test_type=session.test_configuration.test_type,
                is_active=True
            ).first()

        if not scoring_profile:
            return Response(
                {'error': 'No scoring profile available for this test type'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Calculate comprehensive score
            calculator = TestScoreCalculator(session, scoring_profile)
            test_score = calculator.calculate_comprehensive_score()

            # Serialize and return the score
            serializer = TestScoreSerializer(test_score)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': f'Score calculation failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def detailed_breakdown(self, request, pk=None):
        """
        Get detailed score breakdown including category analysis
        """
        test_score = self.get_object()
        
        # Get category scores
        category_scores = CategoryScore.objects.filter(test_score=test_score)
        category_serializer = CategoryScoreSerializer(category_scores, many=True)

        # Prepare detailed response
        response_data = {
            'overall_score': TestScoreSerializer(test_score).data,
            'category_breakdown': category_serializer.data,
            'performance_insights': self._generate_performance_insights(test_score),
            'comparison_data': self._get_comparison_data(test_score)
        }

        return Response(response_data)

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """
        Get scoring analytics and trends for the user
        """
        user_scores = self.get_queryset()
        
        if not user_scores.exists():
            return Response({
                'message': 'No scores available',
                'analytics': {}
            })

        analytics_data = {
            'total_tests': user_scores.count(),
            'test_types': self._get_test_type_analytics(user_scores),
            'performance_trends': self._get_performance_trends(user_scores),
            'strengths_weaknesses': self._get_strengths_weaknesses_summary(user_scores),
            'improvement_suggestions': self._get_improvement_suggestions(user_scores)
        }

        return Response(analytics_data)

    def _generate_performance_insights(self, test_score):
        """Generate insights based on performance"""
        insights = []
        
        # Overall performance insight
        if test_score.percentile_rank >= 90:
            insights.append({
                'type': 'excellent',
                'message': f'Outstanding performance! You scored in the top 10% of test takers.',
                'icon': '🎉'
            })
        elif test_score.percentile_rank >= 75:
            insights.append({
                'type': 'good',
                'message': f'Good performance! You scored better than {test_score.percentile_rank:.0f}% of test takers.',
                'icon': '👍'
            })
        elif test_score.percentile_rank >= 50:
            insights.append({
                'type': 'average',
                'message': f'Average performance. You scored better than {test_score.percentile_rank:.0f}% of test takers.',
                'icon': '📊'
            })
        else:
            insights.append({
                'type': 'improvement_needed',
                'message': 'There\'s room for improvement. Focus on the recommended areas.',
                'icon': '📈'
            })

        # Time efficiency insight
        expected_time = test_score.session.test_configuration.time_limit * 60  # Convert to seconds
        if test_score.completion_time < expected_time * 0.75:
            insights.append({
                'type': 'time_efficient',
                'message': 'Excellent time management! You completed the test efficiently.',
                'icon': '⏱️'
            })
        elif test_score.completion_time > expected_time:
            insights.append({
                'type': 'time_concern',
                'message': 'Consider practicing time management for better performance.',
                'icon': '⏰'
            })

        return insights

    def _get_comparison_data(self, test_score):
        """Get comparison data with other test takers"""
        test_type = test_score.session.test_configuration.test_type
        
        # Get average scores for the same test type
        avg_data = TestScore.objects.filter(
            session__test_configuration__test_type=test_type
        ).aggregate(
            avg_scaled_score=Avg('scaled_score'),
            avg_percentage=Avg('percentage_score'),
            avg_time=Avg('completion_time')
        )

        return {
            'your_score': test_score.scaled_score,
            'average_score': round(avg_data['avg_scaled_score'] or 0, 1),
            'your_percentage': float(test_score.percentage_score),
            'average_percentage': round(float(avg_data['avg_percentage'] or 0), 1),
            'your_time': test_score.completion_time,
            'average_time': round(avg_data['avg_time'] or 0),
            'percentile_rank': float(test_score.percentile_rank or 0)
        }

    def _get_test_type_analytics(self, user_scores):
        """Get analytics by test type"""
        test_types = {}
        
        for score in user_scores:
            test_type = score.session.test_configuration.test_type
            if test_type not in test_types:
                test_types[test_type] = {
                    'count': 0,
                    'avg_score': 0,
                    'best_score': 0,
                    'latest_score': 0,
                    'scores': []
                }
            
            test_types[test_type]['count'] += 1
            test_types[test_type]['scores'].append(score.scaled_score)
            test_types[test_type]['best_score'] = max(
                test_types[test_type]['best_score'], 
                score.scaled_score
            )
            test_types[test_type]['latest_score'] = score.scaled_score  # Assuming ordered by date

        # Calculate averages
        for test_type, data in test_types.items():
            data['avg_score'] = sum(data['scores']) / len(data['scores'])
            del data['scores']  # Remove raw scores to keep response clean

        return test_types

    def _get_performance_trends(self, user_scores):
        """Analyze performance trends over time"""
        if user_scores.count() < 2:
            return {'trend': 'insufficient_data', 'message': 'Need more test attempts to show trends'}

        # Get last 5 scores for trend analysis
        recent_scores = list(user_scores.order_by('-calculated_at')[:5])
        if len(recent_scores) < 2:
            return {'trend': 'insufficient_data'}

        # Simple trend calculation
        first_score = recent_scores[-1].scaled_score
        last_score = recent_scores[0].scaled_score
        
        improvement = last_score - first_score
        
        if improvement > 5:
            trend = 'improving'
            message = f'Great progress! Your scores have improved by {improvement} points.'
        elif improvement < -5:
            trend = 'declining'
            message = f'Scores have declined by {abs(improvement)} points. Consider additional practice.'
        else:
            trend = 'stable'
            message = 'Your performance has been consistent.'

        return {
            'trend': trend,
            'improvement': improvement,
            'message': message,
            'recent_scores': [score.scaled_score for score in reversed(recent_scores)]
        }

    def _get_strengths_weaknesses_summary(self, user_scores):
        """Summarize strengths and weaknesses across all tests"""
        all_strengths = []
        all_weaknesses = []
        
        for score in user_scores:
            all_strengths.extend(score.strengths)
            all_weaknesses.extend(score.weaknesses)

        # Count frequency
        strength_counts = {}
        weakness_counts = {}
        
        for strength in all_strengths:
            strength_counts[strength] = strength_counts.get(strength, 0) + 1
        
        for weakness in all_weaknesses:
            weakness_counts[weakness] = weakness_counts.get(weakness, 0) + 1

        # Get top 3 of each
        top_strengths = sorted(strength_counts.items(), key=lambda x: x[1], reverse=True)[:3]
        top_weaknesses = sorted(weakness_counts.items(), key=lambda x: x[1], reverse=True)[:3]

        return {
            'consistent_strengths': [strength for strength, count in top_strengths],
            'consistent_weaknesses': [weakness for weakness, count in top_weaknesses],
            'strength_details': dict(top_strengths),
            'weakness_details': dict(top_weaknesses)
        }

    def _get_improvement_suggestions(self, user_scores):
        """Generate personalized improvement suggestions"""
        latest_score = user_scores.order_by('-calculated_at').first()
        if not latest_score:
            return []

        suggestions = []
        
        # Add recommendations from latest test
        suggestions.extend(latest_score.recommendations)
        
        # Add trend-based suggestions
        trends = self._get_performance_trends(user_scores)
        if trends['trend'] == 'declining':
            suggestions.append('Consider reviewing fundamentals and taking practice tests')
        elif trends['trend'] == 'stable':
            suggestions.append('Try focusing on your weakest areas to break through plateaus')

        # Add test-specific suggestions based on performance
        if latest_score.percentage_score < 70:
            suggestions.append('Schedule regular practice sessions to build confidence')
        
        if latest_score.completion_time > (latest_score.session.test_configuration.time_limit * 60):
            suggestions.append('Practice time management techniques and timed exercises')

        return suggestions[:5]  # Limit to top 5 suggestions


# Utility function for bulk score calculation
def calculate_scores_for_sessions(session_ids, scoring_profile_id=None):
    """
    Calculate scores for multiple sessions
    Useful for batch processing or migration
    """
    results = {
        'successful': [],
        'failed': [],
        'errors': []
    }
    
    for session_id in session_ids:
        try:
            session = UserTestSession.objects.get(id=session_id, status='completed')
            
            if scoring_profile_id:
                scoring_profile = ScoringProfile.objects.get(id=scoring_profile_id)
            else:
                scoring_profile = ScoringProfile.objects.filter(
                    test_type=session.test_configuration.test_type,
                    is_active=True
                ).first()
            
            if not scoring_profile:
                results['failed'].append(session_id)
                results['errors'].append(f'No scoring profile for session {session_id}')
                continue
            
            calculator = TestScoreCalculator(session, scoring_profile)
            test_score = calculator.calculate_comprehensive_score()
            
            results['successful'].append({
                'session_id': session_id,
                'score_id': test_score.id,
                'scaled_score': test_score.scaled_score
            })
            
        except Exception as e:
            results['failed'].append(session_id)
            results['errors'].append(f'Session {session_id}: {str(e)}')
    
    return results
