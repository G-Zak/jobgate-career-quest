from django.core.cache import caches
import hashlib
import json
import logging
from django.core.cache import caches
import hashlib
import json
import logging
from django.core.cache import caches
import hashlib
import json
import logging

logger = logging.getLogger(__name__)


class CacheManager:
    """Robust cache manager used by auth_api.

    Keeps the interface small: invalidate_test_session_cache,
    invalidate_user_cache, get/set helpers and a module-level instance
    `cache_manager` is provided for existing imports.
    """

    def __init__(self):
        # Accessing Django cache backends at import time can raise if
        # optional backends (e.g. django_redis) aren't installed. To
        # keep the import resilient, attempt to grab configured caches
        # and fall back to a simple in-memory cache object on any error.
        class _SimpleCache:
            def __init__(self):
                self._data = {}

            def get(self, key, default=None):
                return self._data.get(key, default)

            def set(self, key, value, timeout=None):
                self._data[key] = value

            def delete(self, key):
                self._data.pop(key, None)

        try:
            self.dashboard_cache = caches['dashboard']
            self.achievements_cache = caches['achievements']
            self.default_cache = caches['default']
        except Exception:
            # Fall back to in-memory caches so import-time doesn't fail.
            logger.info("Falling back to in-memory cache for cache_utils")
            self.dashboard_cache = _SimpleCache()
            self.achievements_cache = _SimpleCache()
            self.default_cache = _SimpleCache()

    def _cache_key(self, prefix, user_id, *parts):
        key = ':'.join([prefix, str(user_id)] + [str(p) for p in parts])
        return hashlib.md5(key.encode()).hexdigest()

    def invalidate_test_session_cache(self, user_id):
        try:
            self.dashboard_cache.delete(self._cache_key('dashboard_summary', user_id))
            self.achievements_cache.delete(self._cache_key('achievements', user_id))
            logger.info(f"Invalidated test session cache for user: {user_id}")
            return True
        except Exception:
            logger.exception("Error invalidating test session cache")
            return False

    def invalidate_user_cache(self, user_id):
        try:
            self.dashboard_cache.delete(self._cache_key('dashboard_summary', user_id))
            self.achievements_cache.delete(self._cache_key('achievements', user_id))
            logger.info(f"Invalidated cache for user: {user_id}")
            return True
        except Exception:
            logger.exception("Error invalidating user cache")
            return False

    def set(self, cache_name, key, value, timeout=None):
        try:
            cache = getattr(self, f"{cache_name}_cache", self.default_cache)
            cache.set(key, value, timeout)
            return True
        except Exception:
            logger.exception("Error setting cache value")
            return False

    def get(self, cache_name, key):
        try:
            cache = getattr(self, f"{cache_name}_cache", self.default_cache)
            return cache.get(key)
        except Exception:
            logger.exception("Error getting cache value")
            return None


class CacheDecorator:
    """Simple decorator to cache function results using a named cache."""

    def __init__(self, cache_name='default', timeout=None, key_prefix=''):
        self.cache_name = cache_name
        self.timeout = timeout
        self.key_prefix = key_prefix
        self.cache = caches.get(cache_name, caches['default'])

    def _generate_key(self, func_name, args, kwargs):
        payload = json.dumps({'f': func_name, 'a': args, 'k': kwargs}, default=str)
        return self.key_prefix + hashlib.md5(payload.encode()).hexdigest()

    def __call__(self, func):
        def wrapper(*args, **kwargs):
            key = self._generate_key(func.__name__, args, kwargs)
            try:
                value = self.cache.get(key)
                if value is not None:
                    return value
                result = func(*args, **kwargs)
                try:
                    self.cache.set(key, result, self.timeout)
                except Exception:
                    logger.exception("Failed to set cache for decorated function")
                return result
            except Exception:
                logger.exception("Cache decorator error")
                return func(*args, **kwargs)

        return wrapper


# Expose a module-level manager instance for code that imports cache_manager
cache_manager = CacheManager()


def cache_dashboard_data(timeout=600):
    """Cache dashboard data for `timeout` seconds."""
    return CacheDecorator(cache_name='dashboard', timeout=timeout, key_prefix='dashboard:')


def cache_achievements(timeout=1800):
    """Cache achievements data for `timeout` seconds."""
    return CacheDecorator(cache_name='achievements', timeout=timeout, key_prefix='achievements:')


def cache_default(timeout=300):
    """Default cache decorator (short-lived)."""
    return CacheDecorator(cache_name='default', timeout=timeout, key_prefix='default:')
