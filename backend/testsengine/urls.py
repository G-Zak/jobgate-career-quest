from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TestViewSet, TestSessionViewSet

# Import scoring views
try:
    from .scoring_api import TestScoreViewSet
    scoring_available = True
except ImportError:
    scoring_available = False

router = DefaultRouter()
router.register(r'tests', TestViewSet)
router.register(r'sessions', TestSessionViewSet, basename='testsession')

# Add scoring routes if available
if scoring_available:
    router.register(r'scores', TestScoreViewSet, basename='testscore')

urlpatterns = [
    path('api/', include(router.urls)),
]
