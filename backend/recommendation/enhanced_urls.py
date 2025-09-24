"""
Enhanced URL patterns for job recommendations with detailed breakdowns
"""
from django.urls import path
from . import enhanced_views

urlpatterns = [
    # Enhanced recommendation endpoints
    path('enhanced/', enhanced_views.get_enhanced_recommendations, name='enhanced_recommendations'),
    path('detail/<int:job_id>/', enhanced_views.get_recommendation_detail, name='recommendation_detail'),
    
    # Configuration endpoints
    path('weights/', enhanced_views.get_scoring_weights, name='scoring_weights'),
    path('weights/update/', enhanced_views.update_scoring_weights, name='update_scoring_weights'),
    
    # Analytics endpoints
    path('clusters/', enhanced_views.get_cluster_info, name='cluster_info'),
    path('analytics/', enhanced_views.get_recommendation_analytics, name='recommendation_analytics'),
]
