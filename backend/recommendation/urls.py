"""
URL configuration for recommendation app
"""
from django.urls import path
from . import views, ml_views

app_name = 'recommendation'

urlpatterns = [
    # Job offers
    path('job-offers/', views.get_job_offers, name='get_job_offers'),
    
    # Job recommendations
    path('', views.get_recommendations, name='get_recommendations'),
    path('jobs/', views.get_job_recommendations, name='get_job_recommendations'),
    path('advanced/', views.get_advanced_recommendations, name='get_advanced_recommendations'),
    path('proportional-test/', views.get_proportional_test_recommendations, name='get_proportional_test_recommendations'),
    path('saved/', views.get_saved_recommendations, name='get_saved_recommendations'),
    
    # Profile management for recommendations
    path('profile/', views.get_user_profile_for_recommendations, name='get_user_profile'),
    path('profile/sync/', views.sync_profile_with_recommendations, name='sync_profile'),
    
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
    
    # Saved Jobs API
    path('saved-jobs/', views.saved_jobs_api, name='saved_jobs'),
    path('saved-jobs/<int:job_id>/', views.delete_saved_job, name='delete_saved_job'),
]

