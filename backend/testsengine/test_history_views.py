"""
Test History API Views
Provides endpoints for managing and retrieving test history data
"""

from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Avg, Max, Count, Q
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from .models import TestHistory, Test, TestSubmission
from .serializers import (
    TestHistorySerializer, 
    TestHistoryCreateSerializer, 
    TestHistoryDetailSerializer,
    TestHistoryStatsSerializer
)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def save_test_history(request):
    """
    Save a new test session result into test_history table.
    
    Expected payload:
    {
        "user_id": 1,  # Optional, null for anonymous
        "test_id": 1,
        "score": 85.5,
        "percentage_score": 85.5,
        "correct_answers": 17,
        "total_questions": 20,
        "duration_minutes": 18,
        "details": {
            "answers": {"1": "A", "2": "B", ...},
            "metadata": {...}
        },
        "submission_id": 123  # Optional, link to TestSubmission
    }
    """
    try:
        # Get test object
        test_id = request.data.get('test_id')
        if not test_id:
            return Response(
                {'error': 'test_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            test = Test.objects.get(id=test_id)
        except Test.DoesNotExist:
            return Response(
                {'error': 'Test not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Prepare data for serializer
        history_data = {
            'user': request.data.get('user_id'),
            'test': test_id,
            'score': request.data.get('score', 0),
            'percentage_score': request.data.get('percentage_score', 0),
            'correct_answers': request.data.get('correct_answers', 0),
            'total_questions': request.data.get('total_questions', 0),
            'duration_minutes': request.data.get('duration_minutes', 0),
            'details': request.data.get('details', {}),
            'is_completed': request.data.get('is_completed', True)
        }
        
        # Link to submission if provided
        submission_id = request.data.get('submission_id')
        if submission_id:
            try:
                submission = TestSubmission.objects.get(id=submission_id)
                history_data['submission'] = submission
            except TestSubmission.DoesNotExist:
                pass  # Continue without linking
        
        serializer = TestHistoryCreateSerializer(data=history_data)
        if serializer.is_valid():
            history_entry = serializer.save()
            return Response(
                TestHistorySerializer(history_entry).data,
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_user_test_history(request, user_id=None):
    """
    Fetch all test sessions for a given user_id.
    
    Query parameters:
    - limit: Number of results to return (default: 50)
    - offset: Number of results to skip (default: 0)
    - test_type: Filter by test type
    - date_from: Filter from date (YYYY-MM-DD)
    - date_to: Filter to date (YYYY-MM-DD)
    """
    try:
        # Handle anonymous users
        if user_id is None or user_id == 'anonymous':
            user_id = None
        
        # Build query
        queryset = TestHistory.objects.all()
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        else:
            queryset = queryset.filter(user__isnull=True)
        
        # Apply filters
        test_type = request.GET.get('test_type')
        if test_type:
            queryset = queryset.filter(test__test_type=test_type)
        
        date_from = request.GET.get('date_from')
        if date_from:
            queryset = queryset.filter(date_taken__date__gte=date_from)
        
        date_to = request.GET.get('date_to')
        if date_to:
            queryset = queryset.filter(date_taken__date__lte=date_to)
        
        # Pagination
        limit = int(request.GET.get('limit', 50))
        offset = int(request.GET.get('offset', 0))
        
        queryset = queryset[offset:offset + limit]
        
        serializer = TestHistorySerializer(queryset, many=True)
        return Response({
            'results': serializer.data,
            'count': queryset.count(),
            'limit': limit,
            'offset': offset
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_test_history_detail(request, session_id):
    """
    Fetch details of a specific test session.
    """
    try:
        history_entry = TestHistory.objects.get(session_id=session_id)
        serializer = TestHistoryDetailSerializer(history_entry)
        return Response(serializer.data)
        
    except TestHistory.DoesNotExist:
        return Response(
            {'error': 'Test session not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_test_history_stats(request, user_id=None):
    """
    Get comprehensive test history statistics for a user.
    """
    try:
        # Handle anonymous users
        if user_id is None or user_id == 'anonymous':
            user_id = None
        
        # Build base query
        queryset = TestHistory.objects.all()
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        else:
            queryset = queryset.filter(user__isnull=True)
        
        # Calculate statistics
        total_tests = queryset.count()
        
        if total_tests == 0:
            return Response({
                'total_tests_taken': 0,
                'average_score': 0,
                'best_score': 0,
                'tests_passed': 0,
                'tests_failed': 0,
                'category_breakdown': {},
                'recent_tests': [],
                'score_trend': []
            })
        
        # Basic stats
        avg_score = queryset.aggregate(avg=Avg('percentage_score'))['avg'] or 0
        best_score = queryset.aggregate(max=Max('percentage_score'))['max'] or 0
        
        # Pass/fail counts
        tests_passed = queryset.filter(percentage_score__gte=70).count()
        tests_failed = total_tests - tests_passed
        
        # Category breakdown
        category_breakdown = {}
        for entry in queryset.select_related('test'):
            category = entry.test.test_type
            if category not in category_breakdown:
                category_breakdown[category] = {
                    'count': 0,
                    'average_score': 0,
                    'total_score': 0
                }
            category_breakdown[category]['count'] += 1
            category_breakdown[category]['total_score'] += float(entry.percentage_score)
        
        # Calculate averages for each category
        for category in category_breakdown:
            count = category_breakdown[category]['count']
            total = category_breakdown[category]['total_score']
            category_breakdown[category]['average_score'] = round(total / count, 2)
            del category_breakdown[category]['total_score']
        
        # Recent tests (last 10)
        recent_tests = queryset[:10]
        recent_serializer = TestHistorySerializer(recent_tests, many=True)
        
        # Score trend (last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        trend_queryset = queryset.filter(date_taken__gte=thirty_days_ago).order_by('date_taken')
        score_trend = []
        
        for entry in trend_queryset:
            score_trend.append({
                'date': entry.date_taken.strftime('%Y-%m-%d'),
                'score': float(entry.percentage_score),
                'test_name': entry.test.title
            })
        
        # Prepare response
        stats_data = {
            'total_tests_taken': total_tests,
            'average_score': round(float(avg_score), 2),
            'best_score': round(float(best_score), 2),
            'tests_passed': tests_passed,
            'tests_failed': tests_failed,
            'category_breakdown': category_breakdown,
            'recent_tests': recent_serializer.data,
            'score_trend': score_trend
        }
        
        serializer = TestHistoryStatsSerializer(stats_data)
        return Response(serializer.data)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([permissions.AllowAny])
def delete_test_history(request, session_id):
    """
    Delete a specific test history entry.
    """
    try:
        history_entry = TestHistory.objects.get(session_id=session_id)
        history_entry.delete()
        return Response(
            {'message': 'Test history entry deleted successfully'}, 
            status=status.HTTP_204_NO_CONTENT
        )
        
    except TestHistory.DoesNotExist:
        return Response(
            {'error': 'Test session not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
