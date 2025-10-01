from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views, cache_views

urlpatterns = [
    # Authentication endpoints
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('login/', views.UserLoginView.as_view(), name='user-login'),
    path('logout/', views.UserLogoutView.as_view(), name='user-logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # Dashboard endpoints
    path('dashboard/', views.get_user_dashboard, name='user-dashboard'),
    path('dashboard/summary/', views.get_dashboard_summary, name='dashboard-summary'),

    # Cache management endpoints (admin only)
    path('cache/stats/', cache_views.cache_stats, name='cache-stats'),
    path('cache/invalidate-user/', cache_views.invalidate_user_cache, name='invalidate-user-cache'),
    
    # Health check
    path('health/', views.health_check, name='auth-health'),
]
