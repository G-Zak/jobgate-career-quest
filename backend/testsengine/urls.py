from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TestViewSet, TestSessionViewSet, 
    CodingChallengeViewSet, CodingSubmissionViewSet, CodingSessionViewSet
)

router = DefaultRouter()
router.register(r'tests', TestViewSet)
router.register(r'sessions', TestSessionViewSet, basename='testsession')

# Coding challenges routes
router.register(r'challenges', CodingChallengeViewSet)
router.register(r'submissions', CodingSubmissionViewSet, basename='codingsubmission')
router.register(r'coding-sessions', CodingSessionViewSet, basename='codingsession')

urlpatterns = [
    path('api/', include(router.urls)),
]
