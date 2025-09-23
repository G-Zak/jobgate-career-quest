from django.core.cache import caches
from django.core.cache.utils import make_template_fragment_key
from django.utils import timezone
from datetime import timedelta
import hashlib
import json
import logging

logger = logging.getLogger(__name__)


class CacheManager:
    """
    Centralized cache management for dashboard and achievements data
    """
    
    def __init__(self):
        self.dashboard_cache = caches['dashboard']
        self.achievements_cache = caches['achievements']
        self.default_cache = caches['default']
    
    def get_cache_key(self, prefix, user_id, *args):
        """
        Generate a consistent cache key
        """
        key_parts = [prefix, str(user_id)] + [str(arg) for arg in args]
        key_string = ':'.join(key_parts)
        return hashlib.md5(key_string.encode()).hexdigest()
    
    def get_user_dashboard_data(self, user_id):
        """
        Get cached dashboard data for a user
        """
        cache_key = self.get_cache_key('dashboard_summary', user_id)
        try:
            data = self.dashboard_cache.get(cache_key)
            if data:
                logger.info(f"Cache HIT for dashboard data: user_id={user_id}")
                return data
            else:
                logger.info(f"Cache MISS for dashboard data: user_id={user_id}")
                return None
        except Exception as e:
            logger.error(f"Cache error for dashboard data: {str(e)}")
            return None
    
    def set_user_dashboard_data(self, user_id, data, timeout=None):
        """
        Cache dashboard data for a user
        """
        cache_key = self.get_cache_key('dashboard_summary', user_id)
        try:
            self.dashboard_cache.set(cache_key, data, timeout)
            logger.info(f"Cached dashboard data: user_id={user_id}")
            return True
        except Exception as e:
            logger.error(f"Cache error setting dashboard data: {str(e)}")
            return False
    
    def get_user_achievements(self, user_id):
        """
        Get cached achievements data for a user
        """
        cache_key = self.get_cache_key('achievements', user_id)
        try:
            data = self.achievements_cache.get(cache_key)
            if data:
                logger.info(f"Cache HIT for achievements: user_id={user_id}")
                return data
            else:
                logger.info(f"Cache MISS for achievements: user_id={user_id}")
                return None
        except Exception as e:
            logger.error(f"Cache error for achievements: {str(e)}")
            return None
    
    def set_user_achievements(self, user_id, data, timeout=None):
        """
        Cache achievements data for a user
        """
        cache_key = self.get_cache_key('achievements', user_id)
        try:
            self.achievements_cache.set(cache_key, data, timeout)
            logger.info(f"Cached achievements data: user_id={user_id}")
            return True
        except Exception as e:
            logger.error(f"Cache error setting achievements: {str(e)}")
            return False
    
    def invalidate_user_cache(self, user_id):
        """
        Invalidate all cached data for a user
        """
        try:
            # Invalidate dashboard cache
            dashboard_key = self.get_cache_key('dashboard_summary', user_id)
            self.dashboard_cache.delete(dashboard_key)
            
            # Invalidate achievements cache
            achievements_key = self.get_cache_key('achievements', user_id)
            self.achievements_cache.delete(achievements_key)
            
            logger.info(f"Invalidated cache for user: user_id={user_id}")
            return True
        except Exception as e:
            logger.error(f"Cache invalidation error: {str(e)}")
            return False
    
    def invalidate_test_session_cache(self, user_id):
        """
        Invalidate cache when test session data changes
        """
        try:
            # Invalidate dashboard cache (contains test history)
            dashboard_key = self.get_cache_key('dashboard_summary', user_id)
            self.dashboard_cache.delete(dashboard_key)
            
            # Invalidate achievements cache (depends on test performance)
            achievements_key = self.get_cache_key('achievements', user_id)
            self.achievements_cache.delete(achievements_key)
            
            logger.info(f"Invalidated test session cache for user: user_id={user_id}")
            return True
        except Exception as e:
            logger.error(f"Test session cache invalidation error: {str(e)}")
            return False
    
    def get_cache_stats(self):
        """
        Get cache statistics for monitoring
        """
        try:
            stats = {
                'dashboard_cache': {
                    'keys': len(self.dashboard_cache._cache.get_client().keys('dashboard:*')),
                    'memory_usage': self._get_memory_usage('dashboard')
                },
                'achievements_cache': {
                    'keys': len(self.achievements_cache._cache.get_client().keys('achievements:*')),
                    'memory_usage': self._get_memory_usage('achievements')
                },
                'default_cache': {
                    'keys': len(self.default_cache._cache.get_client().keys('careerquest:*')),
                    'memory_usage': self._get_memory_usage('default')
                }
            }
            return stats
        except Exception as e:
            logger.error(f"Cache stats error: {str(e)}")
            # Return basic stats even if Redis info fails
            return {
                'dashboard_cache': {'keys': 0, 'memory_usage': 'Unknown'},
                'achievements_cache': {'keys': 0, 'memory_usage': 'Unknown'},
                'default_cache': {'keys': 0, 'memory_usage': 'Unknown'},
                'error': str(e)
            }
    
    def _get_memory_usage(self, cache_name):
        """
        Get memory usage for a cache
        """
        try:
            cache = caches[cache_name]
            client = cache._cache.get_client()
            info = client.info('memory')
            return info.get('used_memory_human', 'Unknown')
        except Exception as e:
            logger.error(f"Memory usage error for {cache_name}: {str(e)}")
            return 'Unknown'


class CacheDecorator:
    """
    Decorator for caching function results
    """
    
    def __init__(self, cache_name='default', timeout=None, key_prefix=''):
        self.cache_name = cache_name
        self.timeout = timeout
        self.key_prefix = key_prefix
        self.cache = caches[cache_name]
    
    def __call__(self, func):
        def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = self._generate_key(func.__name__, args, kwargs)
            
            # Try to get from cache
            try:
                result = self.cache.get(cache_key)
                if result is not None:
                    logger.info(f"Cache HIT for {func.__name__}: {cache_key}")
                    return result
                
                logger.info(f"Cache MISS for {func.__name__}: {cache_key}")
                
                # Execute function and cache result
                result = func(*args, **kwargs)
                self.cache.set(cache_key, result, self.timeout)
                logger.info(f"Cached result for {func.__name__}: {cache_key}")
                
                return result
                
            except Exception as e:
                logger.error(f"Cache error in {func.__name__}: {str(e)}")
                # Fallback to executing function without caching
                return func(*args, **kwargs)
        
        return wrapper
    
    def _generate_key(self, func_name, args, kwargs):
        """
        Generate a cache key from function name and arguments
        """
        key_parts = [self.key_prefix, func_name]
        
        # Add args (skip self for methods)
        for arg in args:
            if hasattr(arg, 'id'):
                key_parts.append(str(arg.id))
            else:
                key_parts.append(str(arg))
        
        # Add kwargs
        for key, value in sorted(kwargs.items()):
            key_parts.append(f"{key}:{value}")
        
        key_string = ':'.join(key_parts)
        return hashlib.md5(key_string.encode()).hexdigest()


# Global cache manager instance
cache_manager = CacheManager()


# Convenience decorators
def cache_dashboard_data(timeout=600):
    """Cache dashboard data for 10 minutes"""
    return CacheDecorator(cache_name='dashboard', timeout=timeout, key_prefix='dashboard')

def cache_achievements(timeout=1800):
    """Cache achievements data for 30 minutes"""
    return CacheDecorator(cache_name='achievements', timeout=timeout, key_prefix='achievements')

def cache_default(timeout=300):
    """Cache with default settings for 5 minutes"""
    return CacheDecorator(cache_name='default', timeout=timeout, key_prefix='default')
