"""
URL configuration for recommendation app
"""
from django.urls import path
from . import views, ml_views, api_views

app_name = 'recommendation'

urlpatterns = [
    # Job recommendations
    path('', views.get_recommendations, name='get_recommendations'),
    path('jobs/', views.get_job_recommendations, name='get_job_recommendations'),
    path('advanced/', views.get_advanced_recommendations, name='get_advanced_recommendations'),
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

    # Enhanced Cognitive Recommendation API endpoints
    path('api/cognitive/candidate/<int:candidate_id>/recommendations/',
         api_views.get_recommendations_for_candidate,
         name='api_cognitive_candidate_recommendations'),

    path('api/cognitive/candidate/<int:candidate_id>/recompute/',
         api_views.recompute_recommendations_for_candidate,
         name='api_cognitive_recompute_candidate'),

    path('api/cognitive/job/<int:job_offer_id>/recommendations/',
         api_views.get_recommendations_for_job,
         name='api_cognitive_job_recommendations'),

    path('api/cognitive/batch-recompute/',
         api_views.batch_recompute_all,
         name='api_cognitive_batch_recompute'),

    path('api/cognitive/train-clustering/',
         api_views.train_clustering_model,
         name='api_cognitive_train_clustering'),

    path('api/cognitive/scoring-weights/',
         api_views.get_scoring_weights,
         name='api_cognitive_scoring_weights'),

    path('api/cognitive/cluster-info/',
         api_views.get_cluster_info,
         name='api_cognitive_cluster_info'),

    path('api/cognitive/webhook/test-submission/',
         api_views.webhook_test_submission,
         name='api_cognitive_webhook_test'),

    path('api/cognitive/stats/',
         api_views.get_recommendation_stats,
         name='api_cognitive_stats'),

    # Job offers API
    path('api/job-offers/',
         api_views.get_all_job_offers,
         name='api_job_offers'),
]

