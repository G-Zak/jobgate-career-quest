"""
Health check views for Docker and monitoring
"""
from django.http import JsonResponse
from django.db import connection
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)

def health_check(request):
    """
    Health check endpoint for Docker and monitoring
    Returns 200 if all services are healthy, 503 otherwise
    """
    health_status = {
        'status': 'healthy',
        'services': {},
        'timestamp': None
    }
    
    try:
        from django.utils import timezone
        health_status['timestamp'] = timezone.now().isoformat()
    except Exception as e:
        logger.warning(f"Could not get timestamp: {e}")
        health_status['timestamp'] = "unknown"
    
    # Check database connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            health_status['services']['database'] = 'healthy'
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        health_status['services']['database'] = 'unhealthy'
        health_status['status'] = 'unhealthy'
    
    # Check cache (if configured)
    try:
        cache.set('health_check', 'ok', 10)
        cache_result = cache.get('health_check')
        if cache_result == 'ok':
            health_status['services']['cache'] = 'healthy'
        else:
            health_status['services']['cache'] = 'unhealthy'
            health_status['status'] = 'unhealthy'
    except Exception as e:
        logger.warning(f"Cache health check failed: {e}")
        health_status['services']['cache'] = 'not_configured'
    
    # Check if we can import main modules
    try:
        from testsengine.models import Test, Question
        health_status['services']['models'] = 'healthy'
    except Exception as e:
        logger.error(f"Models health check failed: {e}")
        health_status['services']['models'] = 'unhealthy'
        health_status['status'] = 'unhealthy'
    
    # Return appropriate status code
    status_code = 200 if health_status['status'] == 'healthy' else 503
    
    return JsonResponse(health_status, status=status_code)

def readiness_check(request):
    """
    Readiness check endpoint for Kubernetes/Docker
    Returns 200 if ready to serve traffic, 503 otherwise
    """
    try:
        # Check if database is accessible
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        # Check if we can query basic models
        from testsengine.models import Test
        Test.objects.count()
        
        return JsonResponse({'status': 'ready'}, status=200)
    except Exception as e:
        logger.error(f"Readiness check failed: {e}")
        return JsonResponse({'status': 'not_ready', 'error': str(e)}, status=503)

def liveness_check(request):
    """
    Liveness check endpoint for Kubernetes/Docker
    Returns 200 if the application is alive, 503 otherwise
    """
    try:
        # Basic liveness check - just return OK
        return JsonResponse({'status': 'alive'}, status=200)
    except Exception as e:
        logger.error(f"Liveness check failed: {e}")
        return JsonResponse({'status': 'dead', 'error': str(e)}, status=503)
