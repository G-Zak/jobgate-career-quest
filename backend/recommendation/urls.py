"""
URL configuration for recommendation app
"""
from django.urls import path
from . import views, ml_views

app_name = 'recommendation'

urlpatterns = [
    # Job recommendations
    path('', views.get_recommendations, name='get_recommendations'),
    
    # Recommendation management
    path('recommendations/<int:recommendation_id>/status/', 
         views.update_recommendation_status, name='update_recommendation_status'),
    
    # Job applications
    path('jobs/<int:job_id>/apply/', views.apply_to_job, name='apply_to_job'),
    path('applications/', views.get_my_applications, name='my_applications'),
    
    # User preferences
    path('preferences/', views.user_preferences, name='user_preferences'),
    
    # Skills analysis
    path('skills/analysis/', views.user_skills_analysis, name='user_skills_analysis'),
    
    # Machine Learning Recommendations
    path('ml/content-based/', ml_views.get_content_based_recommendations, name='ml_content_based'),
    path('ml/cluster-based/', ml_views.get_cluster_based_recommendations, name='ml_cluster_based'),
    path('ml/hybrid/', ml_views.get_hybrid_recommendations, name='ml_hybrid'),
    path('ml/save/', ml_views.save_ml_recommendations, name='ml_save'),
    path('ml/analytics/', ml_views.get_recommendation_analytics, name='ml_analytics'),
    path('ml/train/', ml_views.train_recommendation_models, name='ml_train'),
]

