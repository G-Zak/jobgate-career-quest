from django.urls import path
from . import views

urlpatterns = [
    # Skills endpoints - minimal working configuration
    path('api/skills/', views.skills_list, name='skills-list'),
    path('api/skills/<int:skill_id>/', views.skill_detail, name='skill-detail'),
    path('api/skills/user/', views.user_skills, name='user-skills'),
    
    # Health check
    path('api/health/', views.skills_health_check, name='skills-health'),
]