from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)

try:
    from .cache_utils import cache_manager
except ImportError:
    cache_manager = None


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def cache_stats(request):
    """
    Get cache statistics for monitoring
    """
    try:
        # Only allow admin users to view cache stats
        if not request.user.is_staff:
            return Response(
                {'error': 'Permission denied. Admin access required.'},
                status=status.HTTP_403_FORBIDDEN
            )

        if not cache_manager:
            return Response({
                'success': False,
                'message': 'Cache manager not available'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response({
            'success': True,
            'stats': {
                'cache_enabled': True,
                'message': 'Cache is running'
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Cache stats error: {str(e)}")
        return Response({
            'success': False,
            'message': 'Failed to get cache stats'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def invalidate_user_cache(request):
    """
    Invalidate cache for a specific user
    """
    try:
        if not request.user.is_staff:
            return Response(
                {'error': 'Permission denied. Admin access required.'},
                status=status.HTTP_403_FORBIDDEN
            )

        user_id = request.data.get('user_id')
        if not user_id:
            return Response({
                'success': False,
                'message': 'user_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        if cache_manager:
            success = cache_manager.invalidate_user_cache(user_id)
            if success:
                return Response({
                    'success': True,
                    'message': f'Cache invalidated for user {user_id}'
                }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Failed to invalidate cache'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        logger.error(f"Cache invalidation error: {str(e)}")
        return Response({
            'success': False,
            'message': 'Failed to invalidate cache'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)