import logging
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db import connection

try:
    from .models import Test, Question
except ImportError:
    # Create minimal fallback classes if models don't exist
    class Test:
        objects = None
    class Question:
        objects = None

logger = logging.getLogger(__name__)

@api_view(['GET'])
def testsengine_health_check(request):
    """
    Health check endpoint for testsengine service
    """
    try:
        # Check database connectivity
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        # Check if models are accessible
        test_count = 0
        question_count = 0
        
        try:
            if Test.objects:
                test_count = Test.objects.count()
            if Question.objects:
                question_count = Question.objects.count()
        except:
            pass
        
        return Response({
            'status': 'healthy',
            'service': 'testsengine',
            'timestamp': timezone.now(),
            'database': 'connected',
            'stats': {
                'total_tests': test_count,
                'total_questions': question_count
            },
            'version': '1.0'
        })
    
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return Response({
            'status': 'unhealthy',
            'service': 'testsengine',
            'timestamp': timezone.now(),
            'error': str(e),
            'version': '1.0'
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def testsengine_status(request):
    """
    Detailed status endpoint for authenticated users
    """
    try:
        return Response({
            'status': 'operational',
            'service': 'testsengine',
            'user': request.user.username,
            'timestamp': timezone.now(),
            'features': {
                'test_taking': True,
                'history_tracking': True,
                'scoring': True
            }
        })
    
    except Exception as e:
        logger.error(f"Status check failed: {e}")
        return Response({
            'status': 'error',
            'service': 'testsengine',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)