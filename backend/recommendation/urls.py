from django.urls import path
from . import views, ml_views, api_views

urlpatterns = [
    # Basic recommendation endpoints
    path('', views.get_recommendations, name='get-recommendations'),
    path('jobs/', views.get_job_matches, name='get-job-matches'),
    path('generate/', views.generate_recommendations, name='generate-recommendations'),
    
    # ML recommendation endpoints
    path('ml/', ml_views.ml_recommendations, name='ml-recommendations'),
    path('ml/train/', ml_views.train_model, name='train-model'),
    path('ml/health/', ml_views.ml_health_check, name='ml-health'),
    
    # API recommendation endpoints
    path('api/', api_views.api_recommendations, name='api-recommendations'),
    path('api/external/', api_views.external_job_search, name='external-job-search'),
    path('api/health/', api_views.api_health_check, name='api-health'),
    
    # General health check
    path('health/', views.recommendation_health_check, name='recommendation-health'),
]