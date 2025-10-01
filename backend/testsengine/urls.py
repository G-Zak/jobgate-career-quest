from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views, test_history_views, health_views

# Create a router for API versioning in the future
router = DefaultRouter()

urlpatterns = [
    # Include the router URLs
    path('api/', include(router.urls)),

    # ========================================
    # HEALTH CHECK ENDPOINTS
    # ========================================
    path('api/health/', health_views.testsengine_health_check, name='health-check'),
    path('api/status/', health_views.testsengine_status, name='testsengine-status'),

    # ========================================
    # CORE TEST MANAGEMENT ENDPOINTS
    # ========================================
    path('api/tests/', views.TestListView.as_view(), name='test-list'),
    path('api/tests/<int:pk>/', views.TestDetailView.as_view(), name='test-detail'),
    path('api/tests/<int:test_id>/questions/', views.TestQuestionsView.as_view(), name='test-questions'),

    # ========================================
    # TEST SUBMISSION ENDPOINTS
    # ========================================
    path('api/tests/<int:test_id>/submit/', views.submit_test, name='submit-test'),
    path('api/my-tests/', views.get_user_tests, name='user-tests'),

    # ========================================
    # TEST SESSION ENDPOINTS
    # ========================================
    path('api/test-sessions/', test_history_views.TestSessionListCreateView.as_view(), name='test-session-list'),
    path('api/test-history/', test_history_views.get_test_history, name='test-history'),
    path('api/test-history/summary/', test_history_views.get_test_history_summary, name='test-history-summary'),
    path('api/test-sessions/<int:session_id>/', test_history_views.get_session_details, name='session-detail'),
    path('api/test-sessions/<int:test_id>/start/', test_history_views.start_test_session, name='start-session'),

    # ========================================
    # ADDITIONAL ENDPOINTS FOR FUTURE FEATURES
    # ========================================
    path('test-health/', views.test_health_check, name='test-health-check'),
]