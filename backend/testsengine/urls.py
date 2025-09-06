from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TestViewSet, TestSessionViewSet

router = DefaultRouter()
router.register(r'tests', TestViewSet)
router.register(r'sessions', TestSessionViewSet, basename='testsession')

urlpatterns = [
    path('api/', include(router.urls)),
]
