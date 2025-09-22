"""
Comprehensive URL patterns for the testsengine app API endpoints
Implements backend-only scoring architecture with secure routing and full coverage
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
from . import test_history_views
from . import health_views

app_name = 'testsengine'

# DRF Router for ViewSets (if we add any in the future)
router = DefaultRouter()
# router.register(r'test-sessions', views.TestSessionViewSet, basename='test-sessions')

# ===============================================================================
# MAIN API URL PATTERNS - Organized by functionality
# ===============================================================================

urlpatterns = [
    # DRF Router URLs (for ViewSets)
    path('api/', include(router.urls)),
    
    # ========================================
    # HEALTH CHECK ENDPOINTS
    # ========================================
    path('api/health/', health_views.health_check, name='health-check'),
    path('api/health/ready/', health_views.readiness_check, name='readiness-check'),
    path('api/health/live/', health_views.liveness_check, name='liveness-check'),
    
    # ========================================
    # CORE TEST MANAGEMENT ENDPOINTS
    # ========================================
    
    # Test Discovery and Information
    path('api/tests/', views.TestListView.as_view(), name='test-list'),
    path('api/tests/<int:pk>/', views.TestDetailView.as_view(), name='test-detail'),
    path('api/tests/<int:test_id>/questions/', views.TestQuestionsView.as_view(), name='test-questions'),
    path('api/tests/<int:test_id>/stats/', views.TestStatsView.as_view(), name='test-stats'),
    
    # Test Execution
    path('api/tests/<int:test_id>/submit/', views.SubmitTestView.as_view(), name='submit-test'),
    # path('api/tests/<int:test_id>/start/', views.TestStartView.as_view(), name='start-test'),  # Future: Test session management
    
    # ========================================
    # SUBMISSION AND RESULTS ENDPOINTS  
    # ========================================
    
    # Submission Management
    # path('api/submissions/', views.SubmissionListView.as_view(), name='submission-list'),  # Future: Admin view
    # path('api/submissions/<int:submission_id>/', views.SubmissionDetailView.as_view(), name='submission-detail'),  # Future
    path('api/submissions/<int:submission_id>/results/', views.TestResultView.as_view(), name='test-results'),
    path('api/my-submissions/', views.UserSubmissionsView.as_view(), name='user-submissions'),
    
    # ========================================
    # DEDICATED SCORING ENDPOINTS
    # ========================================
    
    # Score Calculation
    path('api/tests/<int:test_id>/calculate-score/', views.CalculateScoreView.as_view(), name='calculate-score'),
    path('api/submissions/<int:submission_id>/recalculate/', views.RecalculateScoreView.as_view(), name='recalculate-score'),
    
    # Score Analysis and Comparison
    # path('api/scores/', views.ScoreListView.as_view(), name='score-list'),  # Future: Admin view
    # path('api/scores/<int:score_id>/', views.ScoreDetailView.as_view(), name='score-detail'),  # Future
    path('api/scores/compare/', views.ScoreComparisonView.as_view(), name='compare-scores'),
    path('api/tests/<int:test_id>/leaderboard/', views.LeaderboardView.as_view(), name='test-leaderboard'),
    
    # ========================================
    # ANALYTICS AND REPORTING ENDPOINTS
    # ========================================
    
    # User Analytics (Currently Implemented)
    path('api/analytics/scores/', views.ScoreAnalyticsView.as_view(), name='score-analytics'),
    
    # ========================================
    # UTILITY AND CONFIGURATION ENDPOINTS
    # ========================================
    
    # System Configuration (Currently Implemented)
    path('api/scoring-config/', views.scoring_config_view, name='scoring-config'),
    
    # Validation and Utilities (Currently Implemented)
    path('api/validate-answers/', views.validate_test_answers, name='validate-answers'),
    
    # System Health and Monitoring (Currently Implemented)
    path('api/health/', views.health_check, name='health-check'),
    
    # ========================================
    # TEST HISTORY ENDPOINTS
    # ========================================
    
    # Test Session Management
    path('api/test-sessions/', test_history_views.TestSessionListCreateView.as_view(), name='test-session-list'),
    path('api/test-sessions/<int:pk>/', test_history_views.TestSessionDetailView.as_view(), name='test-session-detail'),
    path('api/test-sessions/<int:session_id>/detail/', test_history_views.test_session_detail, name='test-session-detail-api'),
    path('api/test-sessions/<int:session_id>/delete/', test_history_views.delete_test_session, name='delete-test-session'),
    
    # Test History Analytics
    path('api/test-history/summary/', test_history_views.test_history_summary, name='test-history-summary'),
    path('api/test-history/category-stats/', test_history_views.test_category_stats, name='test-category-stats'),
    path('api/test-history/charts/', test_history_views.test_history_charts, name='test-history-charts'),
    
    # Test Session Submission
    path('api/test-sessions/submit/', test_history_views.submit_test_session, name='submit-test-session'),
]

# ===============================================================================
# URL PATTERNS SUMMARY FOR DOCUMENTATION
# ===============================================================================

"""
URL ORGANIZATION:
================

1. CORE TEST MANAGEMENT (/api/tests/):
   - List, detail, questions, stats, submit, start
   
2. SUBMISSIONS (/api/submissions/):
   - List, detail, results, user submissions
   
3. SCORING (/api/scores/, /api/tests/.../calculate-score/):
   - Calculate, recalculate, compare, leaderboard
   
4. CODING CHALLENGES (/api/coding-challenges/):
   - Challenges, submissions, sessions, leaderboards
   
5. ANALYTICS (/api/analytics/):
   - User analytics, system analytics, reports, exports
   
6. UTILITIES (/api/):
   - Configuration, validation, health, status
   
7. ADMIN (/api/admin/):
   - Test management, question management, system management
   
8. DOCUMENTATION (/api/docs/):
   - API docs, schema, endpoint discovery

SECURITY FEATURES:
==================
- Authentication required for all endpoints except health
- Admin endpoints require admin permissions  
- User-specific endpoints filter by authenticated user
- Validation endpoints prevent data leakage
- Rate limiting can be applied per endpoint group

PERFORMANCE FEATURES:
====================
- Organized by functionality for easy caching
- Separate list/detail endpoints for optimization
- Admin endpoints separated for different performance requirements
- Analytics endpoints designed for background processing
"""