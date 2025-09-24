"""
Test History Views
Handles API endpoints for test history functionality
"""

from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db.models import Avg, Max, Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import TestSession, TestAnswer, Test
from .test_history_serializers import (
    TestSessionHistorySerializer,
    TestSessionCreateSerializer,
    TestSessionUpdateSerializer,
    TestHistorySummarySerializer,
    TestCategoryStatsSerializer,
    TestHistoryChartSerializer
)
from .employability_scoring import EmployabilityScorer


class TestSessionListCreateView(generics.ListCreateAPIView):
    """List and create test sessions for authenticated user"""
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TestSessionCreateSerializer
        return TestSessionHistorySerializer
    
    def get_queryset(self):
        """Get test sessions for current user"""
        return TestSession.objects.filter(
            user=self.request.user
        ).select_related('test').prefetch_related('test_answers__question')
    
    def perform_create(self, serializer):
        """Create test session for current user"""
        serializer.save(user=self.request.user)


class TestSessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a specific test session"""
    permission_classes = [IsAuthenticated]
    serializer_class = TestSessionUpdateSerializer
    
    def get_queryset(self):
        """Get test sessions for current user only"""
        return TestSession.objects.filter(
            user=self.request.user
        ).select_related('test').prefetch_related('test_answers__question')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_history_summary(request):
    """Get comprehensive test history summary for user with employability scoring"""
    # Get profile from query parameters (optional)
    profile = request.GET.get('profile', None)

    # Initialize employability scorer
    scorer = EmployabilityScorer(request.user)

    # Calculate comprehensive employability score
    employability_data = scorer.calculate_overall_score(profile)

    # Get basic session statistics for backward compatibility
    sessions = TestSession.objects.filter(user=request.user).select_related('test')
    total_sessions = sessions.count()
    completed_sessions = sessions.filter(status='completed').count()

    # Time statistics
    completed_sessions_with_scores = sessions.filter(
        status='completed',
        score__isnull=False
    )
    total_time_spent = sum(
        session.time_spent for session in completed_sessions_with_scores
    ) // 60  # Convert to minutes

    # Recent sessions (last 10)
    recent_sessions = sessions.order_by('-start_time')[:10]
    recent_sessions_data = TestSessionHistorySerializer(recent_sessions, many=True).data

    # Tests taken (unique test types)
    tests_taken = list(
        sessions.values_list('test__test_type', flat=True).distinct()
    )

    # Prepare structured response for employability score
    summary_data = {
        # New employability scoring data
        'overall_score': employability_data['overall_score'],
        'categories': employability_data['categories'],
        'total_tests_completed': employability_data['total_tests_completed'],
        'improvement_trend': employability_data['improvement_trend'],
        'score_interpretation': employability_data['score_interpretation'],
        'recommendations': employability_data['recommendations'],
        'profile': employability_data['profile'],
        'last_updated': employability_data['last_updated'].isoformat(),

        # Legacy data for backward compatibility
        'total_sessions': total_sessions,
        'completed_sessions': completed_sessions,
        'average_score': employability_data['overall_score'],  # Use new calculated score
        'best_score': max([cat['best_score'] for cat in employability_data['categories'].values()] + [0]),
        'total_time_spent': total_time_spent,
        'tests_taken': tests_taken,
        'recent_sessions': recent_sessions_data
    }

    return Response(summary_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_category_stats(request):
    """Get statistics by test category"""
    # Get completed sessions grouped by test type for the authenticated user
    category_stats = []
    
    for test_type, _ in Test.TEST_TYPES:
        sessions = TestSession.objects.filter(
            user=request.user,
            test__test_type=test_type,
            status='completed',
            score__isnull=False
        )
        
        if sessions.exists():
            stats = sessions.aggregate(
                count=Count('id'),
                avg_score=Avg('score'),
                max_score=Max('score'),
                last_taken=Max('start_time')
            )
            
            category_stats.append({
                'test_type': test_type,
                'count': stats['count'],
                'average_score': round(stats['avg_score'] or 0, 2),
                'best_score': stats['max_score'] or 0,
                'last_taken': stats['last_taken']
            })
    
    serializer = TestCategoryStatsSerializer(category_stats, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_history_charts(request):
    """Get data for test history charts"""
    # Get completed sessions from last 30 days for the authenticated user
    thirty_days_ago = timezone.now() - timedelta(days=30)
    sessions = TestSession.objects.filter(
        user=request.user,
        status='completed',
        score__isnull=False,
        start_time__gte=thirty_days_ago
    ).order_by('start_time')
    
    # Prepare chart data
    labels = []
    scores = []
    categories = []
    time_spent = []
    
    for session in sessions:
        labels.append(session.start_time.strftime('%Y-%m-%d'))
        scores.append(session.score)
        categories.append(session.test.test_type)
        time_spent.append(session.time_spent // 60)  # Convert to minutes
    
    chart_data = {
        'labels': labels,
        'scores': scores,
        'categories': categories,
        'time_spent': time_spent
    }
    
    serializer = TestHistoryChartSerializer(chart_data)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])  # Temporarily allow any for testing
def submit_test_session(request):
    """Submit a completed test session with answers"""
    try:
        data = request.data
        
        # For testing, use the first user or create a default
        from django.contrib.auth.models import User
        user = request.user if request.user.is_authenticated else User.objects.first()
        
        if not user:
            return Response({"detail": "No user found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Get or create test session
        session_id = data.get('session_id')
        if session_id:
            session = TestSession.objects.get(
                id=session_id, 
                user=user
            )
        else:
            # Create new session
            session = TestSession.objects.create(
                user=user,
                test_id=data['test_id'],
                status='completed'
            )
        
        # Update session with results
        session.status = 'completed'
        session.score = data.get('score', 0)
        session.answers = data.get('answers', {})
        session.time_spent = data.get('time_spent', 0)
        session.end_time = timezone.now()
        session.save()
        
        # Create TestAnswer objects for detailed tracking
        if 'detailed_answers' in data:
            for answer_data in data['detailed_answers']:
                TestAnswer.objects.create(
                    session=session,
                    question_id=answer_data['question_id'],
                    selected_answer=answer_data['selected_answer'],
                    is_correct=answer_data.get('is_correct', False),
                    time_taken=answer_data.get('time_taken', 0)
                )
        
        # Return updated session data
        serializer = TestSessionHistorySerializer(session)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([AllowAny])  # Temporarily allow any for testing
def test_session_detail(request, session_id):
    """Get detailed information about a specific test session"""
    try:
        # For testing, get the session directly without user filtering
        # This allows us to show all sessions regardless of user
        session = TestSession.objects.select_related('test', 'user').prefetch_related('test_answers__question').get(
            id=session_id
        )
        serializer = TestSessionHistorySerializer(session)
        return Response(serializer.data)
    except TestSession.DoesNotExist:
        return Response(
            {'error': 'Test session not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['DELETE'])
@permission_classes([AllowAny])  # Temporarily allow any for testing
def delete_test_session(request, session_id):
    """Delete a test session"""
    try:
        # For testing, use the first user or create a default
        from django.contrib.auth.models import User
        user = request.user if request.user.is_authenticated else User.objects.first()
        
        if not user:
            return Response({"detail": "No user found"}, status=status.HTTP_404_NOT_FOUND)
        
        session = TestSession.objects.get(
            id=session_id,
            user=user
        )
        session.delete()
        return Response(
            {'message': 'Test session deleted successfully'}, 
            status=status.HTTP_204_NO_CONTENT
        )
    except TestSession.DoesNotExist:
        return Response(
            {'error': 'Test session not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
