from django.urls import path
from . import enhanced_views

urlpatterns = [
    # Enhanced recommendation endpoints
    path('', enhanced_views.enhanced_recommendations, name='enhanced-recommendations'),
    path('personalized/', enhanced_views.personalized_recommendations, name='personalized-recommendations'),
    path('health/', enhanced_views.enhanced_health_check, name='enhanced-health'),
]