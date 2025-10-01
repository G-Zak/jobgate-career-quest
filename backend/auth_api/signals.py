from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from testsengine.models import TestSession
from .cache_utils import cache_manager
import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=TestSession)
def invalidate_cache_on_test_session_save(sender, instance, created, **kwargs):
    """
    Invalidate user cache when a test session is created or updated
    """
    try:
        user_id = instance.user.id
        cache_manager.invalidate_test_session_cache(user_id)
        logger.info(
            f"Invalidated cache for user {user_id} after test session {'creation' if created else 'update'}"
        )
    except Exception as e:
        logger.error(f"Error invalidating cache on test session save: {str(e)}")


@receiver(post_delete, sender=TestSession)
def invalidate_cache_on_test_session_delete(sender, instance, **kwargs):
    """
    Invalidate user cache when a test session is deleted
    """
    try:
        user_id = instance.user.id
        cache_manager.invalidate_test_session_cache(user_id)
        logger.info(f"Invalidated cache for user {user_id} after test session deletion")
    except Exception as e:
        logger.error(f"Error invalidating cache on test session delete: {str(e)}")
