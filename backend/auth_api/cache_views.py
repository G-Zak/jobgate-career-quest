from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .cache_utils import cache_manager
import logging

logger = logging.getLogger(__name__)


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
        
        stats = cache_manager.get_cache_stats()
        if stats:
            return Response({
                'success': True,
                'cache_stats': stats,
                'timestamp': cache_manager.default_cache._cache.get_client().time()[0]
            })
        else:
            return Response(
                {'error': 'Failed to retrieve cache statistics'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Exception as e:
        logger.error(f"Error getting cache stats: {str(e)}")
        return Response(
            {'error': f'Failed to get cache stats: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def clear_user_cache(request):
    """
    Clear cache for a specific user
    """
    try:
        # Only allow admin users to clear cache
        if not request.user.is_staff:
            return Response(
                {'error': 'Permission denied. Admin access required.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        user_id = request.data.get('user_id')
        if not user_id:
            return Response(
                {'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        success = cache_manager.invalidate_user_cache(user_id)
        if success:
            return Response({
                'success': True,
                'message': f'Cache cleared for user {user_id}'
            })
        else:
            return Response(
                {'error': 'Failed to clear cache'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Exception as e:
        logger.error(f"Error clearing user cache: {str(e)}")
        return Response(
            {'error': f'Failed to clear cache: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def clear_all_cache(request):
    """
    Clear all cache data
    """
    try:
        # Only allow admin users to clear all cache
        if not request.user.is_staff:
            return Response(
                {'error': 'Permission denied. Admin access required.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Clear all cache databases
        cache_manager.dashboard_cache.clear()
        cache_manager.achievements_cache.clear()
        cache_manager.default_cache.clear()
        
        logger.info("All cache cleared by admin")
        
        return Response({
            'success': True,
            'message': 'All cache cleared successfully'
        })
            
    except Exception as e:
        logger.error(f"Error clearing all cache: {str(e)}")
        return Response(
            {'error': f'Failed to clear cache: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
