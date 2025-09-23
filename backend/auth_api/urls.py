from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Authentication endpoints
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('login/', views.UserLoginView.as_view(), name='user-login'),
    path('logout/', views.UserLogoutView.as_view(), name='user-logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    
    # User profile endpoints
    path('profile/', views.user_profile, name='user-profile'),
    path('achievements/', views.get_achievements, name='user-achievements'),
    
    # Health check
    path('health/', views.health_check, name='auth-health'),
]
